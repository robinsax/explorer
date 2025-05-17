export class APICallError extends Error {}
export class APICallFail extends Error {}

const hydrateModel = (obj: unknown) => {
    if (typeof obj !== 'object' || obj === null) return;

    for (const [key, value] of Object.entries(obj)) {
        if (key.endsWith('_at') && typeof value === 'string') {
            (obj as any)[key] = new Date(value);
        }
    }
};

const dehydrateModel = (obj: unknown) => {
    if (typeof obj !== 'object' || obj === null) return;

    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Date) {
            (obj as any)[key] = value.toISOString();
        }
    }
};

export const apiCall = async <T>({
    path,
    query,
    method = 'get',
    accessKey = null,
    body = null
}: {
    path: string;
    query?: Record<string, string>;
    method: 'get' | 'post' | 'put' | 'delete';
    accessKey?: string | null;
    body?: unknown;
}) => {
    const headers: Record<string, string> = {};
    if (accessKey) {
        headers['Authorization'] = accessKey;
    }
    if (body) {
        headers['Content-Type'] = 'application/json';
        dehydrateModel(body);
        body = JSON.stringify(body);
    }
    let queryStr = '';
    if (query) {
        queryStr = '?' + Object.entries(query).map(e => e.join('=')).join('&');
    }

    const resp = await fetch('/api' + path + queryStr, {
        method: method.toUpperCase(),
        headers,
        body: body as BodyInit
    });
    const respBody = await resp.json();

    if (respBody?.status == 'fail') {
        throw new APICallFail(respBody?.reason);
    }
    else if (!resp.ok) {
        throw new APICallError(respBody.status);
    }

    hydrateModel(respBody?.result);
    return respBody?.result as T;
};
