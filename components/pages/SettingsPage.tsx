import React, {useContext} from "react";
import Image from "next/image";
import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel, IonCheckbox, IonItemDivider, IonIcon, IonButton,
} from '@ionic/react';
import { logOut } from 'ionicons/icons';

import { AppContext } from '../../store/State';

const AvatarHolderSvg = () => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '180px'}}>
        <defs>
          <clipPath id="_clipPath_VGYQ6MZ4obCaDcLZXl98an8UtewzxiFr">
            <rect width="180" height="63"/>
          </clipPath>
        </defs>
        <g clipPath="url(#_clipPath_VGYQ6MZ4obCaDcLZXl98an8UtewzxiFr)">
          <defs>
            <filter id="nfvLb9QntZDusQxw92KwtSZXE1qR2bBv" x="-200%" y="-200%" width="400%" height="400%"
                    filterUnits="objectBoundingBox">
              <feGaussianBlur xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" stdDeviation="4.293609062839028"/>
              <feOffset xmlns="http://www.w3.org/2000/svg" dx="0" dy="0" result="pf_100_offsetBlur"/>
              <feFlood xmlns="http://www.w3.org/2000/svg" floodColor="#CCCCCC" floodOpacity="1"/>
              <feComposite xmlns="http://www.w3.org/2000/svg" in2="pf_100_offsetBlur" operator="in"
                           result="pf_100_dropShadow"/>
              <feBlend xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" in2="pf_100_dropShadow" mode="normal"/>
            </filter>
          </defs>
          <g filter="url(#nfvLb9QntZDusQxw92KwtSZXE1qR2bBv)">
            <path d=" M 158.84 62.526 C 158.824 62.588 158.855 21.632 158.84 21.693 C 152.805 44.917 124.266 62.526 90.016 62.526 C 55.756 62.526 27.212 44.908 21.187 21.676 C 21.173 21.62 21.201 62.582 21.187 62.526 L 158.84 62.526 Z "
                  fill="rgb(255,255,255)" vectorEffect="non-scaling-stroke" strokeWidth="1" stroke="rgb(255,255,255)"
                  strokeLinejoin="miter" strokeLinecap="square" strokeMiterlimit="3"/>
          </g>
          <defs>
            <filter id="vZXXMTY5tYufLUrFA9T8l2V4mrqwSmqt" x="-200%" y="-200%" width="400%" height="400%"
                    filterUnits="objectBoundingBox">
              <feGaussianBlur xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" stdDeviation="4.293609062839028"/>
              <feOffset xmlns="http://www.w3.org/2000/svg" dx="0" dy="0" result="pf_100_offsetBlur"/>
              <feFlood xmlns="http://www.w3.org/2000/svg" floodColor="#CCCCCC" floodOpacity="1"/>
              <feComposite xmlns="http://www.w3.org/2000/svg" in2="pf_100_offsetBlur" operator="in"
                           result="pf_100_dropShadow"/>
              <feBlend xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" in2="pf_100_dropShadow" mode="normal"/>
            </filter>
          </defs>
          <g filter="url(#vZXXMTY5tYufLUrFA9T8l2V4mrqwSmqt)">
            <path d=" M 0.016 0.526 C 10.551 0.526 19.325 9.868 21.144 21.526" fill="rgb(255,255,255)"
                  vectorEffect="non-scaling-stroke" strokeWidth="1" stroke="rgb(255,255,255)" strokeLinejoin="miter"
                  strokeLinecap="square" strokeMiterlimit="3"/>
          </g>
          <defs>
            <filter id="ni5STktVF11F91a0lpRwLKEHPv0D74zs" x="-200%" y="-200%" width="400%" height="400%"
                    filterUnits="objectBoundingBox">
              <feGaussianBlur xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" stdDeviation="4.293609062839028"/>
              <feOffset xmlns="http://www.w3.org/2000/svg" dx="0" dy="0" result="pf_100_offsetBlur"/>
              <feFlood xmlns="http://www.w3.org/2000/svg" floodColor="#CCCCCC" floodOpacity="1"/>
              <feComposite xmlns="http://www.w3.org/2000/svg" in2="pf_100_offsetBlur" operator="in"
                           result="pf_100_dropShadow"/>
              <feBlend xmlns="http://www.w3.org/2000/svg" in="SourceGraphic" in2="pf_100_dropShadow" mode="normal"/>
            </filter>
          </defs>
          <g filter="url(#ni5STktVF11F91a0lpRwLKEHPv0D74zs)">
            <path d=" M 180 0.526 C 169.465 0.526 160.707 9.851 158.887 21.509" fill="rgb(255,255,255)"
                  vectorEffect="non-scaling-stroke" strokeWidth="1" stroke="rgb(255,255,255)" strokeLinejoin="miter"
                  strokeLinecap="square" strokeMiterlimit="3"/>
          </g>
          <path d=" M 179.016 1.526 L 158.887 21.693 L 158.84 62.526 L 21.144 61.526 L 21.016 20.526 L 21.016 20.526 C 21.014 20.605 11.604 11.472 0.015 0.144 C 0.015 0.144 0.014 1.184 0.017 2.063 C 0.034 7.684 0.127 28.241 0.016 62.526 L 180.016 62.526 L 180 0.526"
                fill="rgb(255,255,255)" vectorEffect="non-scaling-stroke" strokeWidth="1" stroke="rgb(255,255,255)"
                strokeLinejoin="miter" strokeLinecap="square" strokeMiterlimit="3"/>
        </g>
      </svg>
  )
}

const SettingsPage = () => {
  const { state } = useContext(AppContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Paramètres</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="w-full h-full p-4" slot="fixed">
          <div className="relative w-32 h-32 m-auto">
            <Image className="rounded-full" layout='fill' src={`/img/${state.user.name}.jpg`} alt={state.user.name}/>
          </div>
          <div className="flex flex-col" style={{ minHeight: 'calc(100% - 7rem)', transform: 'translateY(-3rem)' }}>
            <div className="flex" style={{ height: '63px' }}>
              <div className="flex-grow h-full rounded-tl-2xl" style={{ boxShadow: 'rgb(204 204 204 / 50%) -1px -5px 10px'}}></div>
              <AvatarHolderSvg />
              <div className="flex-grow h-full rounded-tr-2xl" style={{ boxShadow: 'rgb(204 204 204 / 50%) 1px -5px 10px'}}></div>
            </div>
            <div className="flex flex-col justify-between flex-grow py-4 rounded-b-2xl" style={{ boxShadow: 'rgb(204 204 204 / 50%) 0px 10px 10px'}}>
              <IonList>
                <IonItemDivider>
                  <IonLabel>
                    Profile
                  </IonLabel>
                </IonItemDivider>
                <IonItem button detail={false}>
                  <IonLabel>Changer la photo de profil</IonLabel>
                </IonItem>
                <IonItemDivider>
                  <IonLabel>
                    Notes
                  </IonLabel>
                </IonItemDivider>
                <IonItem>
                  <IonLabel>Trier par dernière modification</IonLabel>
                  <IonCheckbox />
                </IonItem>
              </IonList>
              <div className="flex flex-col px-2">
                  <IonButton color="danger">
                    Déconnexion
                    <IonIcon slot="end" icon={logOut}></IonIcon>
                  </IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
