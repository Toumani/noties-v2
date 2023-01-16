import React, { useContext, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useLocation } from "react-router-dom";
import { v4 as uuid } from 'uuid';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal, IonInput, IonSelect, IonButton, IonLabel, IonItem, IonSelectOption, IonAlert, IonToast, IonChip
} from "@ionic/react";

import { AppContext } from '../../store/State';
import Card from '../ui/Card';
import { add, trash, close } from "ionicons/icons";
import { Category, Note } from "../../model";
import { addNote, deleteNote } from "../../store/actions";
import { defaultCategoryColor } from "./CategoryPage";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface NoteCardProps {
  note: Note,
  history: RouteComponentProps,
  openToast: (message: string) => void,
}

const NoteCard: React.FC<NoteCardProps> = ({ note, history, openToast }) => {
  const { state, dispatch } = useContext(AppContext);
  const { id, title } = note;
  const nbElement = note.tasks.length;
  const nbElementDone = note.tasks.filter(it => it.done).length;
  let category: Category | null = null;
  if (note.categoryId)
    category = state.categories.find(it => it.id === note.categoryId);
  let categoryName: string | null = null, categoryColor : string | null = null;
  if (category) {
    categoryName = category.name;
    categoryColor = category.color;
  }
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const nbElementRemaining = nbElement - nbElementDone;
  let message: string;
  if (nbElement == 0)
    message = 'Aucun élément';
  else if (nbElementRemaining == 0)
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
        <div className="flex row justify-between">
          <div className="w-9/12">
            { categoryName && <h4 className="font-bold py-0 text-s uppercase" style={{ color: categoryColor }}>{categoryName}</h4> }
            <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{title}</h2>
          </div>
          <div className="w-2/12">
            <IonButton color="danger" fill="clear"
             onClick={(e) => {
               e.stopPropagation()
               setDeleteAlertOpen(true)
             }}
            >
              <IonIcon icon={trash} />
            </IonButton>
          </div>
        </div>
        <div className="flex w-full h-3 my-4 bg-gray-400 rounded-full">
          <div
            className="h-full rounded-full"
            style={{
              width: (nbElement != 0 ? nbElementDone / nbElement * 100 : 0) + '%',
              backgroundColor: categoryColor || defaultCategoryColor,
              transitionProperty: 'width',
              transitionDuration: '.4s',
            }}
          ></div>
        </div>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{message}</p>
      </div>
      <IonAlert
        isOpen={isDeleteAlertOpen}
        onDidDismiss={() => setDeleteAlertOpen(false)}
        header={`Supprimer "${title}" ?`}
        message="Cette action est irréversible !"
        buttons={[
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Ok',
            handler: () => {
              dispatch(deleteNote(note));
              openToast("Note supprimée");
            }
          },
        ]}
      />
    </Card>
  )
}

const HomePage: React.FC<RouteComponentProps> = ({ match, history }) => {
  const { state, dispatch } = useContext(AppContext);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ newNoteTitle, setNewNoteTitle ] = useState('');
  const [ newNoteCategoryId, setNewNoteCategoryId ] = useState('');
  const [ isToastOpen, setToastOpen ] = useState(false);
  const [ toastMessage, setToastMessage ] = useState('');

  const query = useQuery();
  const categoryId = query.get("categoryId");

  const { displayedNotes, categoryName } = useMemo(() => {
    if (categoryId) {
      const displayedNotes = (state.notes as Note[]).filter(it => it.categoryId === categoryId);
      const category = (state.categories as Category[]).find(it => it.id === categoryId);
      const categoryName = category ? category.name : null;
      return { displayedNotes, categoryName }
    }
    else
      return { displayedNotes: state.notes, categoryName: null };
  }, [query, match, state.notes]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        { categoryName &&
          <IonChip onClick={() => {
            history.push('/tabs/notes');
          }}>
            <IonLabel>{ categoryName }</IonLabel>
            <IonIcon icon={close} color="danger"></IonIcon>
          </IonChip>
        }
        { displayedNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            history={history}
            openToast={() => {
              setToastMessage('Note supprimée')
              setToastOpen(true)
            }}
          />
        ))}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { setModalOpen(true) }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setModalOpen(false)}
        >
          <div className="flex flex-col justify-start">
            <h3 className="mx-4 mt-4 text-2xl font-bold dark:text-gray-50">
              Nouvelle note
            </h3>
            <IonItem>
              <IonLabel position="stacked">Titre</IonLabel>
              <IonInput value={newNoteTitle} onIonChange={e => setNewNoteTitle(e.detail.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Catégorie</IonLabel>
              <IonSelect
                value={newNoteCategoryId}
                okText="OK"
                cancelText="Fermer"
                onIonChange={e => setNewNoteCategoryId(e.detail.value)}
              >
                { state.categories.map(category => (
                  <IonSelectOption key={category.id} value={category.id}>{ category.name }</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <div className="flex flex-col mt-2">
              <IonButton disabled={newNoteTitle === ''} onClick={() => {
                dispatch(addNote({
                  id: uuid(),
                  title: newNoteTitle,
                  created: new Date(),
                  categoryId: newNoteCategoryId === '' ? null : newNoteCategoryId,
                  tasks: []
                }));
                setNewNoteCategoryId('');
                setNewNoteTitle('');
                setModalOpen(false);
              }}>Créer</IonButton>
              <IonButton fill="clear" onClick={() => setModalOpen(false)}>Annuler</IonButton>
            </div>
          </div>
        </IonModal>
        <IonToast
          isOpen={isToastOpen}
          message={toastMessage}
          duration={3000}
          color="success"
          onDidDismiss={() => setToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  )
}

export default HomePage;