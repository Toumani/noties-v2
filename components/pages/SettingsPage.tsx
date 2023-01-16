import React, { useContext } from "react";
import {RouteComponentProps} from "react-router";
import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel, IonItemDivider, IonToggle,
} from '@ionic/react';

import { AppContext } from '../../store/State';
import { setDarkMode } from "../../store/actions";

const SettingsPage: React.FC<RouteComponentProps> = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Paramètres</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItemDivider>
            <IonLabel>
              Application
            </IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel>Mode sombre</IonLabel>
            <IonToggle checked={state.settings.darkMode} onIonChange={e => dispatch(setDarkMode(e.detail.checked))} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
