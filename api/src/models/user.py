import uuid
import bcrypt
from typing import Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy import ForeignKey, UUID, Column, String, DateTime, and_
from sqlalchemy.orm import Session, relationship

from ..config import ACCESS_KEY_EXPIRY_HOURS
from .base import Base, BaseModel

class UserModel(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class User(Base):
    __tablename__ = 'users'
    __model__ = UserModel

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    password_digest = Column(String)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    @classmethod
    def create(cls, username: str, email: str, password: str, **kwargs):
        user = cls(username=username, email=email, **kwargs)
        user.set_password(password)
        return user

    @classmethod
    def get(cls, session: Session, id: str) -> 'User':
        return session.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_by_identifier(cls, session: Session, email: str) -> 'User':
        return session.query(cls).filter(cls.email == email).first()

    def set_password(self, password: str):
        salt = bcrypt.gensalt()
        self.password_digest = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password: str) -> bool:
        if not self.password_digest:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_digest.encode('utf-8'))

class UserAccessKeyModel(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    expires_at: datetime
    revoked_at: Optional[datetime] = None

class UserAccessKey(Base):
    __tablename__ = 'user_access_keys'
    __model__ = UserAccessKeyModel

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    expires_at = Column(DateTime, default=datetime.now(timezone.utc) + timedelta(hours=ACCESS_KEY_EXPIRY_HOURS))
    revoked_at = Column(DateTime, nullable=True)

    user = relationship('User', backref='access_keys')

    @classmethod
    def create(cls, user_id: str) -> 'UserAccessKey':
        return cls(user_id=user_id)

    @classmethod
    def get_by_id(cls, session: Session, key_id: str) -> Optional['UserAccessKey']:
        return session.query(cls).filter(cls.id == key_id).first()

    @classmethod
    def revoke_all_for_user(cls, session: Session, user_id: str):
        session.query(cls).filter(and_(
            cls.user_id == user_id,
            cls.revoked_at == None,
            cls.expires_at > datetime.now(timezone.utc)
        )).update({ 'revoked_at': datetime.now(timezone.utc) })

    @property
    def is_valid(self) -> bool:
        return self.expires_at > datetime.now(timezone.utc) and not self.revoked_at

    def refresh(self):
        self.expires_at = datetime.now(timezone.utc) + timedelta(hours=ACCESS_KEY_EXPIRY_HOURS)

    def revoke(self):
        self.revoked_at = datetime.now(timezone.utc)
