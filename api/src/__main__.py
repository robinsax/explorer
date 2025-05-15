import sys
import uvicorn

sys.path.insert(0, '.')

from src.config import SERVICE_PORT

uvicorn.run('src:app', host='0.0.0.0', port=SERVICE_PORT, reload=True)
