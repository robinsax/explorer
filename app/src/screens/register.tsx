import { h } from 'preact';

import { useI18n } from '../contexts';
import { RegisterForm } from '../components/forms/register-form';
import { SimplePageLayout } from '../components/layouts/simple-page';
import { Footer } from '../components/common/footer';

export const RegisterPage = () => {
    const _ = useI18n();

    return (
        <main class="register-page">
            <SimplePageLayout>
                <h1 class="al-l">{ _('Register') }</h1>
                <RegisterForm />
            </SimplePageLayout>
            <Footer/>
        </main>
    );
};
