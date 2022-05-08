import React, {useContext} from "react";
import {RouteComponentProps} from "react-router";

import Image from "next/image";

import {IonContent, IonHeader, IonToolbar, IonPage, IonTitle} from "@ionic/react";

import { AppContext } from '../../store/State';
import Card from '../ui/Card';

const NoteCard = ({ id, title, categoryName, categoryColor, nbElementDone, nbElement, author, history }) => {
  const nbElementRemaining = nbElement - nbElementDone;
  let message: string;
  if (nbElementRemaining == 0)
    message = 'Aucun élément restant';
  else if (nbElementRemaining == 1)
    message = '1 élément restant';
  else
    message = nbElementRemaining + ' éléments restants';

  return (
    <Card
      className="mx-auto my-4 cursor-pointer"
      onClick={() => history.push(`/tabs/notes/${id}`)}
    >
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h4 className="font-bold py-0 text-s uppercase" style={{ color: categoryColor }}>{categoryName}</h4>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="flex w-full h-3 my-4 bg-gray-400 rounded-full">
          <div className="h-full rounded-full"
               style={{width: nbElementDone / nbElement * 100 + '%', backgroundColor: categoryColor}}></div>
        </div>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{message}</p>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 relative">
            <Image layout='fill' src={`/img/${author}.jpg`} className="rounded-full" alt=""/>
          </div>
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">{author}</h3>
        </div>
      </div>
    </Card>
  )
}

const HomePage: React.FC<RouteComponentProps> = ({ match, history }) => {
  const { state } = useContext(AppContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        { state.notes && state.notes.map(note => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            categoryName={note.category.name}
            categoryColor={note.category.color}
            nbElementDone={note.nbElementDone}
            nbElement={note.nbElement}
            author={note.author}
            history={history}
          />
        ))}
      </IonContent>
    </IonPage>
  )
}

export default HomePage;