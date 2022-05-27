import React, {useState} from 'react';
import {RouteComponentProps} from "react-router";
import {IonContent, IonPage} from "@ionic/react";
import Image from "next/image";

interface YellowCoverSvgProps {
  expanded: boolean
}

const YellowCoverSvg: React.FC<YellowCoverSvgProps> = ({ expanded}) => {
  const d = expanded ?
    'path("M106,500 C40,500 40,500 -60,500 V0 H560 V500 C500,500 440,500 360,500 C224,500 196,500 106,500Z")' :
    'path("M106 242 C40,249.66 40,380 -60,340 V0 H560 V240 C500,315 440,337 360,334 C224,329 196,231 106,242Z")';

  return (
    <div className="inline-block relative w-full h-full align-middle overflow-hidden"
         style={{ paddingBottom: '100%' }}
    >
      <div
        className="w-full bg-yellow"
        style={{
          transitionDuration: '1.4s',
          height: expanded ? 'calc((100vh - 100vw)' : 0
        }}
      ></div>
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path style={{ transitionDuration: '1.4s', d }}
          fill="#e1e100"
        />
      </svg>
    </div>
  )
}

const LoginPage: React.FC<RouteComponentProps> = () => {
  const [coverExpanded, setCoverExpanded] = useState(false);
  return (
    <IonPage>
      <IonContent>
        <YellowCoverSvg expanded={coverExpanded} />
        <div
          className="flex flex-col justify-start relative top-1/2 w-full px-8 space-y-4"
          style={{ opacity: coverExpanded ? 0 : 1, transitionDuration: '.6s' }}
          slot="fixed"
        >
          <header className="flex flex-row items-center justify-center mb-4">
            <h1 className="text-3xl mr-4 text-gray-800 dark:text-gray-400">Noties</h1>
            <Image width={50} height={50} src={`/logo.png`} className="rounded-full" alt="Logo" />
          </header>
          <input
            className="px-6 py-2 rounded-full border-2 border-yellow text-gray-700 focus:border-yellow focus:border-4 focus:ring-blue-700"
            type="text"
            placeholder="Nom d'utilisateur"/>
          <input className="px-6 py-2 rounded-full border-2 border-yellow text-gray-700 focus:border-yellow focus:border-4 focus:ring-blue-700" type="password" placeholder="···········"/>
          <button
            className="px-6 py-2 text-gray-50 font-bold bg-yellow rounded-full"
            style={{ marginTop: '1.5rem' }}
            onClick={() => {
              setCoverExpanded(!coverExpanded)
              setTimeout(() => setCoverExpanded(false), 3000)
            } }
          >Connexion</button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoginPage;