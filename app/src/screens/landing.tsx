import { h } from 'preact';

import { useAuth, useI18n } from '../contexts';
import { SimplePageLayout } from '../components/layouts/simple-page';
import { Footer } from '../components/common/footer';
import { useEffect, useState } from 'preact/hooks';

export const LandingPage = () => {
    const [user, authHandler] = useAuth();
    const _ = useI18n();

    const [key, setKey] = useState<unknown>(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setKey(authHandler.currentAccessKey);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <main class="landing-page">
            <SimplePageLayout>
                <p>
                    { _('Welcome!') }
                    <br/><br/>
                    { user && <pre class="al-l">{ JSON.stringify(user, null, 2) }</pre> }
                    { key && <pre class="al-l">{ JSON.stringify(key, null, 2) }</pre> }
                </p>
            </SimplePageLayout>
            <Footer />
        </main>
    );
};
