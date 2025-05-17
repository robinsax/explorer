import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { APICallFail } from '../../logic/api';
import { useAuth, useI18n } from '../../contexts';
import { Failure, FailureInfo, Field, Submit } from './parts';

export const RegisterForm = () => {
    const [user, authHandler] = useAuth();
    const _ = useI18n();

    const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [failure, setFailure] = useState<FailureInfo>(null);

    const onSubmit = async (e: Event) => {
        e.preventDefault();

        try {
            await authHandler.apiCall({
                path: '/users',
                method: 'post',
                body: {
                    username,
                    identifier,
                    password
                }
            });
            await authHandler.authenticate(identifier, password);
        } catch (err) {
            if (err instanceof APICallFail) {
                setFailure(err);
                return;
            } else {
                throw err;
            }
        }

        route('/');
    };

    return (
        <form onSubmit={ onSubmit }>
            <Failure
                failure={ failure }
                cases={ {
                    already_exists: _('Email already in use')
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
                label={ _('Username') }
                type="text"
                onChange={ val => {
                    setUsername(val);
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

            <div class="al-r">
                <Submit label={ _('Register') }/>
            </div>
        </form>
    );
};
