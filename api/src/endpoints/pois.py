from typing import Tuple
from fastapi import Request, Depends
from sqlalchemy.orm import Session

from api.src.endpoints.auth import get_current_user

from ..database import get_session
from ..app import app, ok, fail
from ..models import BaseModel, POI, POI_TYPES

@app.get('/pois')
async def find_pois_spatial(req: Request, session: Session = Depends(get_session)):
    bounds = req.query_params.get('bounds')

    try:
        bounds = [float(c) for c in bounds.split(',')]
    except ValueError:
        return fail('invalid_bounds')
    if len(bounds) != 4:
        return fail('invalid_bounds')

    pois = POI.find_within_bounds(session, bounds)

    return ok([poi.to_model() for poi in pois])

class POICreation(BaseModel):
    name: str
    type: str
    location: Tuple[float, float]

@app.post('/pois')
async def create_poi(create: POICreation, req: Request, session: Session = Depends(get_session)):
    user = get_current_user(req, session)
    if not user:
        return fail('unauthorized')

    if create.type not in POI_TYPES:
        return fail('invalid_type')

    poi = POI.create(create.name, create.type, create.location, user)
    session.add(poi)
    session.commit()
    session.refresh(poi)

    return ok(poi.to_model())
