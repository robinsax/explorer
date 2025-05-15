import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { AuthHandler } from '@/logic/auth-handler';
import { UserModel } from '@/models';

export const authContext = createContext<[UserModel | null, AuthHandler]>([null, null as unknown as AuthHandler]);
export const useAuth = () => useContext(authContext); 

export const i18nContext = createContext<(str: string) => string>(null as unknown as (str: string) => string);
export const useI18n = () => useContext(i18nContext);
