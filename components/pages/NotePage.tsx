import React, {useContext, useMemo, useState} from "react";
import { RouteComponentProps } from "react-router";
import { AppContext } from "../../store/State";
import {
  IonBackButton, IonButton,
  IonButtons, IonCheckbox,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonInput,
  IonItem, IonLabel,
  IonList, IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { v4 as uuid } from 'uuid';
import { pencil, trash, checkmark, add } from 'ionicons/icons';
import { Category, Note, Task } from "../../model";
import { addTask, deleteTask, updateTask } from "../../store/actions";

interface TaskViewProps {
  note: Note,
  task: Task,
  edit: boolean
}

const taskNames: string[] = [
  'Randonnée en montagne',
  'Visite au musée',
  'Acheter de l\'eau minérale',
  'Renouveller inscription tennis',
  'Acheter un corde de guitare',
  'Sortir le chien',
  'Laver la voiture',
  'Payer les factures',
  'Recharger l\'abonnement Jawaz',
  '5 kg de pommes de terre',
  '1 gousse d\'ail',
  'Sac à main',
  'Ceinture en cuir',
  'Pochette téléphone',
  'Casque sans fil',
  'Monter la vidéo de mariage',
]

const TaskView: React.FC<TaskViewProps> = ({ note, task, edit }) => {
  const { dispatch } = useContext(AppContext);
  const { index, title, done } = task;
  const [newTitle, setNewTitle] = useState(title)
  return (
    <IonItem key={index}>
      { edit ?
        <>
          <IonInput
            value={newTitle}
            onIonChange={e => setNewTitle(e.detail.value)}
            onIonBlur={() => dispatch(updateTask(note, { ...task, title: newTitle }))}
          />
          <IonButton color="danger" onClick={() => dispatch(deleteTask(note, task))}>
            <IonIcon icon={trash} />
          </IonButton>
        </>
          :
        <>
          <IonLabel>{title}</IonLabel>
          <IonCheckbox
            checked={done}
            slot="end"
            onIonChange={e => dispatch(updateTask(note, { ...task, done: e.detail.checked }))}
          />
        </>
      }
    </IonItem>
  )
}

const NotePage: React.FC<RouteComponentProps> = ({ match, history }) => {
  const { state, dispatch } = useContext(AppContext);
  const { params: { noteId } } = match

  const [ edit, setEdit ] = useState(false);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ newTaskTitle, setNewTaskTitle ] = useState('');

  const { note, category } = useMemo(() => {
    const note = (state.notes as Note[]).find(it => it.id === noteId);
    const category = note ? (state.categories as Category[]).find(it => it.id === note.categoryId) : undefined;
    return { note, category }
  }, [match]);

  if (typeof note === "undefined" || typeof category === 'undefined') {
    history.push('/')
    return <div></div>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/notes" />
          </IonButtons>
          <IonTitle>{ category.name }</IonTitle>
          <IonButtons slot="end">
            <IonButton color={edit ? "success" : "default"} onClick={() => setEdit(!edit)}>
              <IonIcon icon={edit ? checkmark : pencil} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1 className="px-1 py-2 text-2xl font-bold">
          { note.title }
        </h1>
        <IonList>
          { note.tasks.sort((a, b) => a.index - b.index).map((task) =>
            <TaskView
              key={task.id}
              note={note}
              task={task}
              edit={edit}
            />
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setModalOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal
          isOpen={isModalOpen}
        >
          <div className="flex flex-col justify-start">
            <h3 className="mx-4 mt-4 text-2xl font-bold dark:text-gray-50">
              Nouvelle tâche
            </h3>
            <IonItem>
              <IonLabel position="stacked">Titre</IonLabel>
              <IonInput
                value={newTaskTitle}
                onIonChange={e => setNewTaskTitle(e.detail.value)}
                placeholder={taskNames[Math.round((Math.random()*100)%taskNames.length)]}
              />
            </IonItem>
            <div className="flex flex-col mt-2">
              <IonButton disabled={newTaskTitle == ''} onClick={() => {
                dispatch(addTask(note, { id: uuid(), title: newTaskTitle, index: 0, done: false }));
                setModalOpen(false);
                setNewTaskTitle('');
              }}>Créer</IonButton>
              <IonButton fill="clear" onClick={() => setModalOpen(false)}>Annuler</IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
    );
}

export default NotePage;