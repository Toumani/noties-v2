import React, {useCallback, useContext, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {useLocation} from "react-router-dom";

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

import {AppContext, setCategories, setNotes} from '../../store/State';
import Card from '../ui/Card';
import {add, trash, close} from "ionicons/icons";
import axios from "axios";
import {API_URL, BASE_URL} from "../../lib/constants";
import {Category} from "../../pages/api/categories";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const NoteCard = ({ note, history, update, openToast }) => {
  const { id, title, nbElementDone, nbElement, author } = note;
  const categoryName = note.category.name;
  const categoryColor = note.category.color;
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
            <h4 className="font-bold py-0 text-s uppercase" style={{ color: categoryColor }}>{categoryName}</h4>
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
              backgroundColor: categoryColor,
              transitionProperty: 'width',
              transitionDuration: '.4s',
            }}
          ></div>
        </div>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{message}</p>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 relative">
            <img src={`${BASE_URL}img/${author}.jpg`} className="rounded-full" alt={author}/>
          </div>
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">{author}</h3>
        </div>
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
              axios.delete(`${API_URL}notes/${id}`)
                .then(() => {
                  update()
                  openToast("Note supprimée")
                })
                .catch(() => openToast('Une erreur est survenue. Réessayez plus tard.'))
            }
          },
        ]}
      />
    </Card>
  )
}

const HomePage: React.FC<RouteComponentProps> = ({ match, history }) => {
  const { state, dispatch } = useContext(AppContext);
  const [ categoryName, setCategoryName ] = useState<string | null>(null);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ newNoteTitle, setNewNoteTitle ] = useState('');
  const [ newNoteCategoryId, setNewNoteCategoryId ] = useState(-1);
  const [ isToastOpen, setToastOpen ] = useState(false);
  const [ toastMessage, setToastMessage ] = useState('');

  const query = useQuery();
  const categoryId = query.get("categoryId");

  const fetchNotes = useCallback(() => {
    let queryParameter = '';
    if (categoryId) {
      axios
        .get(API_URL + `categories/${categoryId}`)
        .then(response => {
          setCategoryName((response.data as Category).name)
        })
        .catch(() => {
          setCategoryName(null);
          setToastMessage('Erreur lors du chargement de la catégorie');
          setToastOpen(true);
        })
      queryParameter = `?categoryId=${categoryId}`;
    }
    else
      setCategoryName(null);
    axios
      .get(API_URL + `notes${queryParameter}`)
      .then((res) => {
        if (res.data.success)
          dispatch(setNotes(res.data.data))
      })
      .catch(error => {
        if (error.response.status === 401) {
          history.push('/login')
        }
      })
  }, [query]);

  useEffect(fetchNotes, [query, match]);

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
        { state.notes && state.notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            history={history}
            update={fetchNotes}
            openToast={() => {
              setToastMessage('Note supprimée')
              setToastOpen(true)
            }}
          />
        ))}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {
            axios
              .get(API_URL + 'categories')
              .then((res) => {
                  dispatch(setCategories(res.data))
              })
              .catch(error => {
                if (error.response.status === 401) {
                  history.push('/login')
                }
              })
            setModalOpen(true);
          }}>
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
              <IonButton disabled={newNoteTitle == '' || newNoteCategoryId < 0} onClick={() => {
                axios
                  .post(API_URL + 'notes', {
                    title: newNoteTitle,
                    categoryId: newNoteCategoryId
                  })
                  .then(() => {
                    setNewNoteCategoryId(-1);
                    setNewNoteTitle('');
                    fetchNotes();
                    setModalOpen(false);
                  })
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