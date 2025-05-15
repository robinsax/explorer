import { JSX, h } from 'preact';

import './simple-page.scss';

export const SimplePageLayout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <div class="simple-page">
            <div class="simple-page-content">
                { children }
            </div>
        </div>
    );
};
