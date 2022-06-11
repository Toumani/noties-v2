import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {AppContext} from "../../store/State";
import {
  IonAlert,
  IonBackButton, IonButton,
  IonButtons, IonCheckbox,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonInput,
  IonItem, IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar, useIonViewDidEnter
} from "@ionic/react";
import { pencil, trash, checkmark, add } from 'ionicons/icons';
import axios from "axios";
import {NoteWithCategory} from "../../pages/api/notes";
import {Task} from "../../pages/api/tasks/[nid]";

interface TaskViewProps {
  task: Task,
  edit: boolean,
  update: (Task) => void
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

const TaskView: React.FC<TaskViewProps> = ({ task, edit, update }) => {
  const { index, title, done } = task;
  const [newTitle, setNewTitle] = useState(title)
  return (
    <IonItem key={index}>
      { edit ?
        <>
          <IonInput value={newTitle} onIonChange={e => setNewTitle(e.detail.value)} />
          <IonButton color="danger">
            <IonIcon icon={trash} />
          </IonButton>
        </>
          :
        <>
          <IonLabel>{title}</IonLabel>
          <IonCheckbox checked={done} slot="end" onIonChange={e => {
            axios
              .put(`/api/tasks`, { ...task, done: e.detail.checked })
              .then((res) => update(res.data.result))
              .catch(e => {
                // TODO notify that something went wrong
              })
          }} />
        </>
      }
    </IonItem>
  )
}

const NotePage: React.FC<RouteComponentProps> = ({ match, history }) => {
  const { state } = useContext(AppContext);
  const { params: { noteId } } = match

  const [ edit, setEdit ] = useState(false);
  const [ isAlertOpen, setAlertOpen ] = useState(false);
  const [ tasks, setTasks ] = useState<Task[]>([])

  const note: NoteWithCategory = state.notes.find(n => n.id === parseInt(noteId));

  useIonViewDidEnter(() => {
    axios.get(`/api/tasks/${noteId}`)
      .then(res => {
        setTasks(res.data as Task[]);
      })
      .catch(error => {
        if (error.response.status === 401) {
          history.push('/login')
        }
      })
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/notes" />
          </IonButtons>
          <IonTitle>{ note.category.name }</IonTitle>
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
          { tasks.sort((a, b) => a.index - b.index).map((task) =>
            <TaskView
              key={task.id}
              task={task}
              edit={edit}
              update={(updatedTask) => {
                const task = tasks.filter(it => it.id = updatedTask.id)[0];
                task.done = updatedTask.done;
              }}
            />
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setAlertOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setAlertOpen(false)}
          header={"Nouvelle tâche"}
          inputs={[
            {
              name: 'title',
              type: 'text',
              placeholder: taskNames[Math.round((Math.random()*100)%taskNames.length)]
            }
          ]}
          buttons={[
            {
              text: 'Annuler',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Ok',
              handler: () => { console.log('Creating task'); }
            },
          ]}
        />
      </IonContent>
    </IonPage>
    );
}

export default NotePage;