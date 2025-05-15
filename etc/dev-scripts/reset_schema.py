import os
import sys

sys.path.insert(0, './api')
os.environ['LAX_API_CONFIG'] = '1'

from src.databases import get_pg_engine
from src.models import Base

def reset_schema():
    engine = get_pg_engine()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

reset_schema()
print('Done.')
