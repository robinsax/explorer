import { h } from 'preact';

import { useI18n } from '../contexts';
import { LoginForm } from '../components/forms/login-form';
import { SimplePageLayout } from '../components/layouts/simple-page';
import { Footer } from '../components/common/footer';

export const LoginPage = () => {
    const _ = useI18n();

    return (
        <main class="login-page">
            <SimplePageLayout>
                <h1 class="al-l">{ _('Log in') }</h1>
                <LoginForm />
            </SimplePageLayout>
            <Footer/>
        </main>
    );
};
