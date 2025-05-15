import { h } from 'preact';
import { render } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Router, Route } from 'preact-router';

import { Header } from './components/common/header';
import { RegisterPage } from './screens/register';
import { LoginPage } from './screens/login';
import { LandingPage } from './screens/landing';
import { NotFoundPage } from './screens/not-found';

import { UserModel } from './models';
import { AuthHandler } from './logic/auth-handler';
import { authContext, i18nContext } from './contexts';

import './main.scss';

const App = () => {
  const [user, setUser] = useState<UserModel | null>(null);
  const authHandler = useMemo(() => new AuthHandler(setUser), []);

  const i18nResolver = useMemo(() => (str: string) => str, []);

  return (
      <div class="site-root">
        <authContext.Provider value={ [user, authHandler] }>
          <i18nContext.Provider value={ i18nResolver }>
            <Header />
            <Router>
                <Route path="/" component={ LandingPage }/>
                <Route path="/login" component={ LoginPage }/>
                <Route path="/register" component={ RegisterPage }/>
                <Route default component={ NotFoundPage }/>
            </Router>
          </i18nContext.Provider>
        </authContext.Provider>
      </div>
  );
};

render(<App />, document.getElementById('app-mount') as HTMLElement);
