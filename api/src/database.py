from typing import Optional
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import POSTGRES_URI

_engine: Optional[Engine] = None
_SessionLocal: Optional[Session] = None

def get_engine() -> Engine:
    global _engine

    if _engine is None:
        _engine = create_engine(POSTGRES_URI)

    return _engine

def get_session() -> Session:
    global _SessionLocal

    if _SessionLocal is None:
        engine = get_engine()
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = _SessionLocal()
    try:
        yield session
    finally:
        session.close()
