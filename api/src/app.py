from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import ALLOWED_ORIGINS

_sentinel = object()

def ok(result=_sentinel):
    data = { 'status': 'ok' }
    if result is not _sentinel:
        data['result'] = result
    return data

def fail(reason=_sentinel):
    data = { 'status': 'fail' }
    if reason is not _sentinel:
        data['reason'] = reason
    return data

def error(detail=_sentinel):
    data = { 'status': 'error' }
    if detail is not _sentinel:
        data['detail'] = detail
    return data

app = FastAPI(root_path='/api')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.exception_handler(404)
async def not_found_handler(req: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=fail('not_found')
    )

@app.exception_handler(405)
async def method_not_allowed_handler(req: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        content=fail('method_not_allowed')
    )

@app.exception_handler(500)
async def internal_server_error_handler(req: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error('internal_err')
    )

@app.get('/health')
async def health_check():
    return ok()
