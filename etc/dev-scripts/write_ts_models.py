import os
import sys
import uuid
from datetime import datetime
from typing import Union, get_origin, get_args

sys.path.insert(0, './api')
os.environ['LAX_API_CONFIG'] = '1'
from src import models

def get_ts_field_type(field_type):
    if field_type is str or field_type is uuid.UUID:
        return 'string'
    elif field_type is int or field_type is float:
        return 'number'
    elif field_type is bool:
        return 'boolean'
    elif field_type is datetime:
        return 'Date'
    elif issubclass(field_type, models.BaseModel):
        return field_type.__name__
    return 'unknown'

def write_ts_models(src_module):
    ts_defines = list()

    for symbol_name in dir(src_module):
        model = getattr(src_module, symbol_name)
        if not isinstance(model, type) or \
        not issubclass(model, models.BaseModel) or \
        model is models.BaseModel:
            continue

        ts_fields = list()
        for field_name, field in model.model_fields.items():
            field_type = field.annotation
            origin_type = get_origin(field_type)

            is_required = field.is_required

            if origin_type is Union:
                type_args = [t for t in get_args(field_type) if t is not type(None)]
                if len(type_args) == 1:
                    field_type = type_args[0]
                    is_required = False
                else:
                    field_type = 'unknown'

            ts_fields.append(
                field_name +
                (': ' if is_required else '?: ') +
                get_ts_field_type(field_type)
            )

        ts_defines.append(
            'export type ' + model.__name__ + ' = {\n    ' +
            '\n    '.join(ts_fields) +
            '\n};'
        )

    return '\n\n'.join(ts_defines)

with open('./app/src/models.ts', 'w') as f:
    f.write('/** AUTO-GENERATED */\n\n')
    f.write(write_ts_models(models))

print('Done.')
