from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import POSTGRES_URI, MONGO_URI

_pg_engine: Optional[Engine] = None
_mongo_client: Optional[MongoClient] = None
_SessionLocal: Optional[Session] = None

def get_mongo_client() -> MongoClient:
    global _mongo_client

    if _mongo_client is None:
        _mongo_client = MongoClient(MONGO_URI)

    return _mongo_client

def get_mongo_db() -> Database:
    return get_mongo_client()['main']

def get_pg_engine() -> Engine:
    global _pg_engine

    if _pg_engine is None:
        _pg_engine = create_engine(POSTGRES_URI)

    return _pg_engine

def get_pg_session() -> Session:
    global _SessionLocal

    if _SessionLocal is None:
        engine = get_pg_engine()
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = _SessionLocal()
    try:
        yield session
    finally:
        session.close()
