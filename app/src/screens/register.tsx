import { h } from 'preact';

import { useI18n } from '../contexts';
import { RegisterForm } from '../components/forms/register-form';
import { ModalLayout } from '../components/layouts/modal';

export const RegisterRoute = () => {
    const _ = useI18n();

    return (
        <div class="register-route">
            <ModalLayout>
                <h1 class="al-l">{ _('Register') }</h1>
                <RegisterForm />
            </ModalLayout>
        </div>
    );
};
