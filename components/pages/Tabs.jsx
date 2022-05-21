import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';

import Home from './HomePage';
import Note from './NotePage';
import CategoryPage from './CategoryPage';
import ListDetail from './ListDetail';
import SettingsPage from './SettingsPage';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/notes" component={Home} exact={true} />
        <Route path="/tabs/notes/:noteId" component={Note} exact={true} />
        <Route path="/tabs/categories" component={CategoryPage} exact={true} />
        <Route path="/tabs/lists/:listId" component={ListDetail} exact={true} />
        <Route path="/tabs/settings" component={SettingsPage} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/notes" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/notes">
          <IonIcon icon={flash} />
          <IonLabel>Notes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/categories">
          <IonIcon icon={list} />
          <IonLabel>Catégories</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/settings">
          <IonIcon icon={cog} />
          <IonLabel>Paramètres</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
