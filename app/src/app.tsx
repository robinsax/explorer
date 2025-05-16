import { h } from 'preact';
import { render } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { route, Router, Route } from 'preact-router';

import { Header } from './components/common/header';
import { RegisterRoute } from './screens/register';
import { LoginRoute } from './screens/login';
import { MainRoute } from './screens/main';
import { MapContainer } from './map/map-container';

import { UserModel } from './models';
import { AuthHandler } from './logic/auth-handler';
import { authContext, i18nContext } from './contexts';

import './main.scss';

const NotFoundPage = () => {
    useEffect(() => { route('/'); }, []);

    return null;
};

const App = () => {
  const [user, setUser] = useState<UserModel | null>(null);
  const authHandler = useMemo(() => new AuthHandler(setUser), []);

  const i18nResolver = useMemo(() => (str: string) => str, []);

  return (
      <div class="site-root">
        <authContext.Provider value={ [user, authHandler] }>
          <i18nContext.Provider value={ i18nResolver }>
            <Header/>
            <MapContainer/>
            <Router>
                <Route path="/" component={ MainRoute }/>
                <Route path="/login" component={ LoginRoute }/>
                <Route path="/register" component={ RegisterRoute }/>
                <Route default component={ NotFoundPage }/>
            </Router>
          </i18nContext.Provider>
        </authContext.Provider>
      </div>
  );
};

render(<App />, document.getElementById('app-mount') as HTMLElement);
