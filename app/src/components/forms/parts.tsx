import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';

import { APICallFail } from '../../logic/api';

import './parts.scss';

export const Field = ({ label, type, onChange }: {
    label: string, type: string, onChange: (value: string) => void
}) => {
    const [value, setValue] = useState('');

    return (
        <div class="form-field">
            <label>
                { label }
            </label>
            <input
                type={ type }
                value={ value }
                onInput={ e => {
                    setValue(e.currentTarget.value);
                    onChange(e.currentTarget.value);
                } }
            />
        </div>
    );
};

export const Submit = ({ label }: { label: string }) => {
    return (
        <button class="form-submit" type="submit">{ label }</button>
    );
};

export type FailureInfo = APICallFail | null;

export const Failure = ({ failure, cases = {} }: {
    failure: FailureInfo, cases?: Record<string, string>
}) => {
    return (
        <Fragment>
            { failure && <div class="form-failure">
                { cases[failure.message] || failure.message }
            </div> }
        </Fragment>
    );
};
