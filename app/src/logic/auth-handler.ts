import { UserAccessKeyModel, UserModel } from '@/models';
import { apiCall } from './api';

export class AuthHandler {
    private accessKey: UserAccessKeyModel | null;
    private user: UserModel | null;
    private refreshInterval: number | null;
    private onUserChanged: (user: UserModel | null) => void;

    constructor(onUserChanged: (user: UserModel | null) => void) {
        this.user = null;
        this.refreshInterval = null;
        this.accessKey = null;

        this.onUserChanged = onUserChanged;

        this.init();
    }

    private async init() {
        this.accessKey = this.loadStoredAccessKey();
        try {
            await this.refreshAccessKey();
        } catch (err) {
            this.updateAccessKey(null);
        }

        await this.fetchUser();
    }

    private loadStoredAccessKey() {
        if (!localStorage.getItem('access_key')) return null;

        return JSON.parse(localStorage.getItem('access_key') as string) as UserAccessKeyModel;
    }

    private updateAccessKey(accessKey: UserAccessKeyModel | null) {
        this.accessKey = accessKey;

        if (accessKey) {
            localStorage.setItem('access_key', JSON.stringify(accessKey));
        } else {
            localStorage.removeItem('access_key');
        }
    }

    private async fetchUser() {
        if (!this.accessKey) {
            this.user = null;
            this.onUserChanged(null);
            return;
        }

        this.user = await apiCall<UserModel>({
            path: '/auth',
            method: 'get',
            accessKey: this.accessKey?.id
        });
        this.onUserChanged(this.user);
    }

    private async refreshAccessKey() {
        if (!this.accessKey) return;

        this.updateAccessKey(await apiCall<UserAccessKeyModel>({
            path: '/auth',
            method: 'put',
            accessKey: this.accessKey?.id
        }));
    }

    get currentAccessKey(): UserAccessKeyModel | null {
        return this.accessKey;
    }

    async authenticate(identifier: string, password: string) {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }

        this.updateAccessKey(await apiCall<UserAccessKeyModel>({
            path: '/auth',
            method: 'post',
            accessKey: null,
            body: { identifier, password }
        }));
        this.refreshInterval = setInterval(() => this.refreshAccessKey(), 60 * 1000);
        await this.fetchUser();
    }

    async deauthenticate() {
        if (!this.accessKey) return;

        await apiCall({
            path: '/auth/active',
            method: 'delete',
            accessKey: this.accessKey.id
        });

        this.updateAccessKey(null);
        this.fetchUser();
    }

    apiCall<T>(params: Omit<Parameters<typeof apiCall>[0], 'accessKey'>) {
        return apiCall<T>({
            ...params,
            accessKey: this.accessKey?.id
        });
    }
}
