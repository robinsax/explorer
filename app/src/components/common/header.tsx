import { h } from 'preact';
import { useAuth, useI18n } from '../../contexts';

import './header.scss';

export const Header = () => {
    const [user, authHandler] = useAuth();
    const _ = useI18n();

    return (
        <header class="site-header">
            <a href="/" class="brand">{ _('explorer') }</a>
            <div class="user-area">
                { user ? (
                    <div class="user-profile">
                        { user.username }
                        <br/>
                        <button
                            onClick={ () => authHandler.deauthenticate() }
                        >
                            { _('Log out') }
                        </button>
                    </div>
                ) : (
                    <a href="/login" class="button user-login">
                        { _('Log in') }
                    </a>
                ) }
            </div>
        </header>
    );
};
