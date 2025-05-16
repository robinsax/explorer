import { JSX, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import './modal.scss';

export const ModalLayout = ({ children, class: class_ = '' }: {
    children: JSX.Element | JSX.Element[];
    class?: string;
}) => {
    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            if (e.key === 'Escape') route('/');
        };
        window.addEventListener('keyup', callback);

        return () => {
            window.removeEventListener('keyup', callback);
        };
    }, []);

    return (
        <div class={ 'modal ' + class_ }>
            <div class="modal-background"></div>
            <div class="modal-panel">
                <div class="modal-controls">
                    <a href="/" class="modal-close">&times;</a>
                </div>
                <div class="modal-content">
                    { children }
                </div>
            </div>
        </div>
    );
};
