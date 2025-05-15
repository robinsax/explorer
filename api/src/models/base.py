import uuid
from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

def _base_to_model(self) -> BaseModel:
    model_cls = getattr(self, '__model__', None)
    if model_cls is None:
        raise NotImplementedError()
    
    fields = model_cls.model_fields.keys()
    data = dict()
    for field in fields:
        value = getattr(self, field)
        if isinstance(value, uuid.UUID):
            value = str(value)
        data[field] = value

    return model_cls(**data)
Base.to_model = _base_to_model
