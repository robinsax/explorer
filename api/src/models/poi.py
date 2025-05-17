import uuid
from enum import Enum
from typing import Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, UUID, ForeignKey
from sqlalchemy.orm import Session
from geoalchemy2 import Geometry

from .base import Base, BaseModel
from .user import User

POI_TYPES = ['general']

class POIModel(BaseModel):
    id: Optional[str] = None
    name: str
    type: str
    created_at: Optional[datetime] = None
    created_by: str
    location: Tuple[float, float]

class POI(Base):
    __tablename__ = 'pois'
    __model__ = POIModel

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, index=True)
    type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    location = Column(Geometry('POINT', srid=4326), nullable=False)

    @classmethod
    def create(cls, name: str, type: str, location: Tuple[float, float], creator: User):
        return cls(name=name, type=type, location=location, created_by=creator.id)

    @classmethod
    def get(cls, session: Session, id: str) -> 'POI':
        return session.query(cls).filter(cls.id == id).first()

    @classmethod
    def find_within_bounds(cls, session: Session, bounds: tuple[float, float, float, float]) -> list['POI']:
        return session.query(cls).filter(cls.location.ST_Within(bounds)).all()
