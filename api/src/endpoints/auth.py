import uuid
from typing import Optional
from fastapi import Request, Depends
from sqlalchemy.orm import Session

from ..databases import get_pg_session
from ..app import app, ok, fail
from ..models import BaseModel, User, UserAccessKey

def get_current_access_key(req: Request, session: Session) -> Optional[UserAccessKey]:
    access_key_str = req.headers.get('Authorization')
    if not access_key_str:
        return None

    try:
        uuid.UUID(access_key_str)
    except ValueError:
        return None
    
    access_key = UserAccessKey.get_by_id(session, access_key_str)
    if not access_key:
        return None
    
    return access_key

def get_current_user(req: Request, session: Session) -> Optional[User]:
    access_key = get_current_access_key(req, session)
    if not access_key:
        return None
    
    return access_key.user

class UserRegistration(BaseModel):
    username: str
    identifier: str
    password: str

@app.post('/users')
async def register(reg: UserRegistration, session: Session = Depends(get_pg_session)):
    if User.get_by_identifier(session, reg.identifier):
        return fail('already_exists')

    user = User.create(reg.username, reg.identifier, reg.password)

    session.add(user)
    session.commit()
    session.refresh(user)

    return ok(user.to_model())

@app.get('/auth')
async def check_auth(req: Request, session: Session = Depends(get_pg_session)):
    user = get_current_user(req, session)
    if not user:
        return fail('access_key')

    return ok(user.to_model())

class UserLogin(BaseModel):
    identifier: str
    password: str

@app.post('/auth')
async def authenticate(auth: UserLogin, session: Session = Depends(get_pg_session)):
    user = User.get_by_identifier(session, auth.identifier)
    if not user or not user.check_password(auth.password):
        return fail('creds')

    access_key = UserAccessKey.create(user_id=user.id)
    session.add(access_key)
    session.commit()
    session.refresh(access_key)

    return ok(access_key.to_model())

@app.put('/auth')
async def refresh_access(req: Request, session: Session = Depends(get_pg_session)):
    access_key = get_current_access_key(req, session)
    if not access_key:
        return fail('access_key')

    access_key.refresh()
    session.commit()
    session.refresh(access_key)

    return ok(access_key.to_model())

@app.delete('/auth/active')
async def deauthenticate(req: Request, session: Session = Depends(get_pg_session)):
    access_key = get_current_access_key(req, session)
    if not access_key:
        return fail('access_key')

    access_key.revoke()
    session.commit()
    
    return ok(access_key.to_model())

@app.delete('/auth')
async def deauthenticate_all(req: Request, session: Session = Depends(get_pg_session)):
    user = get_current_user(req, session)
    if not user:
        return fail('access_key')

    UserAccessKey.revoke_all_for_user(session, user.id)
    session.commit()
    
    return ok()
