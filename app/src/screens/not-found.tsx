import { h } from 'preact';

import { useI18n } from '../contexts';
import { SimplePageLayout } from '../components/layouts/simple-page';
import { Footer } from '../components/common/footer';

export const NotFoundPage = () => {
    const _ = useI18n();

    return (
        <main class="not-found-page">
            <SimplePageLayout>
                <p>{ _('Not found') }</p>
            </SimplePageLayout>
            <Footer/>
        </main>
    );
};
