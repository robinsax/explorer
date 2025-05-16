import { h } from 'preact';

import { useI18n } from '../contexts';
import { LoginForm } from '../components/forms/login-form';
import { ModalLayout } from '../components/layouts/modal';

import './login.scss';

export const LoginRoute = () => {
    const _ = useI18n();

    return (
        <div class="login-route">
            <ModalLayout class="login-modal">
                <h1 class="al-l">{ _('Log in') }</h1>
                <LoginForm />
            </ModalLayout>
        </div>
    );
};
