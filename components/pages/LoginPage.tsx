import React, {useContext, useState} from 'react';
import {RouteComponentProps} from "react-router";
import {IonContent, IonPage} from "@ionic/react";
import Image from "next/image";
import axios from "axios";
import YellowCoverSvg from '../ui/YellowCoverSvg'
import {API_URL} from "../../lib/constants";
import {AppContext, setUser} from "../../store/State";



const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { dispatch } = useContext(AppContext);
  const [coverExpanded, setCoverExpanded] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-700 focus:border-yellow focus:border-4 focus:ring-blue-700 dark:text-gray-50 dark:bg-gray-800"
            type="text"
            placeholder="Nom d'utilisateur"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-700 focus:border-yellow focus:border-4 focus:ring-blue-700 dark:text-gray-50 dark:bg-gray-800"
            type="password"
            placeholder="···········"
            onChange={e => setPassword(e.target.value)}/>
          <button
            className="px-6 py-2 text-gray-50 font-bold bg-yellow rounded-full dark:text-gray-800"
            style={{ marginTop: '1.5rem' }}
            onClick={async () => {
              axios
                .post(API_URL + 'login', {
                  username, password
                })
                .then(res => {
                    dispatch(setUser(res.data))
                    setMessage('')
                    setCoverExpanded(true)
                    setTimeout(() => {
                      setCoverExpanded(false)
                      history.push('/tabs')
                    }, 1000)
                })
                .catch(() => setMessage('Nom d\'utilisateur et/ou mdp incorrect'))
            }}
          >Connexion</button>
          <p className="text-red-600">{ message }</p>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoginPage;