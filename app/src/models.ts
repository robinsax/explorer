/** AUTO-GENERATED */

export type POIModel = {
    id?: string
    name: string
    type: unknown
    created_at?: Date
    created_by: string
    location: [number, number]
};

export type UserAccessKeyModel = {
    id: string
    user_id: string
    created_at: Date
    expires_at: Date
    revoked_at?: Date
};

export type UserModel = {
    id?: string
    username: string
    email: string
    created_at?: Date
    updated_at?: Date
};