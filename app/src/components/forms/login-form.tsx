import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { APICallFail } from '../../logic/api';
import { useAuth, useI18n } from '../../contexts';
import { Field, Failure, Submit, FailureInfo } from './parts';

import './login-form.scss';

export const LoginForm = () => {
    const [user, authHandler] = useAuth();
    const _ = useI18n();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [failure, setFailure] = useState<FailureInfo>(null);

    const onSubmit = async (e: Event) => {
        e.preventDefault();

        try {
            await authHandler.authenticate(identifier, password);
        } catch (err) {
            if (err instanceof APICallFail) {
                setPassword('');
                setFailure(err);
                return;
            } else {
                throw err;
            }
        }

        route('/');
    };

    return (
        <form class="login-form" onSubmit={ onSubmit }>
            <Failure
                failure={ failure }
                cases={ {
                    creds: _('Invalid login')
                } }
            />

            <Field
                label={ _('Email') }
                type="text"
                onChange={ val => {
                    setIdentifier(val);
                    setFailure(null);
                } }
            />
            <Field
                label={ _('Password') }
                type="password"
                onChange={ val => {
                    setPassword(val);
                    setFailure(null);
                } }
            />

            <div class="login-action">
                <Submit label={ _('Log in') }/>
            </div>

            <div class="login-register-cta">
                { _('Need an account?') }
                <a class="button" href="/register">{ _('Register') }</a>
            </div>
        </form>
    );
};
