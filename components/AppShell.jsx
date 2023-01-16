import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import Tabs from './pages/Tabs';
import LoginPage from "./pages/LoginPage";
import { useContext } from "react";
import { AppContext } from "../store/State";

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell = () => {
  const { state } = useContext(AppContext);
  return (
    <div id="body" className={state.settings.darkMode ? 'dark' : ''}>
      <IonApp>
          <IonReactRouter>
            <IonRouterOutlet id="main" >
              <Route path="/login" component={LoginPage} exact={true} />
              <Route path="/tabs" render={() => <Tabs />} />
              <Route exact path="/" render={() => <Redirect to="/tabs" />} />
            </IonRouterOutlet>
          </IonReactRouter>
      </IonApp>
    </div>
  );
};

export default AppShell;
