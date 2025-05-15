import { h } from 'preact';
import { useAuth, useI18n } from '../../contexts';

import './header.scss';

export const Header = () => {
    const [user, authHandler] = useAuth();
    const _ = useI18n();

    return (
        <header class="site-header">
            <div class="left">
                <a href="/" class="brand">bonsai</a>
            </div>
            <div class="right">
                <div class="user-area">
                    { user ? (
                        <span>
                            { user.username }
                            <button onClick={ () => authHandler.deauthenticate() }>
                                { _('Log out') }
                            </button>
                        </span>
                    ) : (
                        <a class="button" href="/login">{ _('Log in') }</a>
                    ) }
                </div>
            </div>
        </header>
    );
};
