import { h } from 'preact';

import { useI18n } from '../../contexts';

import './footer.scss';

export const Footer = () => {
    const _ = useI18n();

    return (
        <footer class="site-footer">
            <div class="copyright">{ _('(c) 2025 Robin Saxifrage') }</div>
        </footer>
    );
};
