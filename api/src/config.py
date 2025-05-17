import os

def _resolve(key, type=str, default=str()):
    key = key.upper()

    value = default
    if key in os.environ:
        value = os.environ[key]
    
    if not value and 'LAX_API_CONFIG' in os.environ:
        return default

    if type is list:
        return value.split(',')
    return type(value)

POSTGRES_URI = _resolve('postgres_uri')

SERVICE_PORT = _resolve('service_port', int)
ALLOWED_ORIGINS = _resolve('allowed_origins', list)

ACCESS_KEY_EXPIRY_HOURS = _resolve('access_key_expiry_hours', int, '1')
