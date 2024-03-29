import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { v4 as uuid } from 'uuid';

import {
  IonToast,
  IonAlert,
  IonButton,
  IonContent, IonFab, IonFabButton,
  IonHeader,
  IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonModal,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { addCategory, AppContext, deleteCategory, updateCategory } from "../../store/State";
import Card from "../ui/Card";
import { pencil, trash, colorPalette, menu, add } from "ionicons/icons";
import ColoredRadio from "../ui/ColoredRadio";
import { Category } from "../../model";
import EmptyListMessage from "../ui/EmptyListMessage";

interface CategoryCardProps {
  category: Category,
  nbNotes: number,
  history: RouteComponentProps,
  openToast: (string) => void,
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, nbNotes, openToast, history }) => {
  const { dispatch } = useContext(AppContext);
  const [popoverState, setPopoverState] = useState({ isOpen: false, event: undefined });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [categoryNewName, setCategoryNewName] = useState('');
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  let message: string;
  if (nbNotes == 0)
    message = 'Aucune note';
  else if (nbNotes == 1)
    message = '1 note';
  else
    message = nbNotes + ' notes';

  return (
    <Card
      className="mx-auto my-4 cursor-pointer"
      onClick={() => { history.push(`/tabs/notes?categoryId=${category.id}`) }}
    >
      <div className="h-2 rounded-t-full" style={{ backgroundColor: category.color }}></div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{category.name}</h2>
          <div className="flex flex-row justify-end items-center">
            <IonButton color="dark" fill="clear"
              onClick={(e) => {
                e.stopPropagation();
                const newColor = nextColor(category.color);
                const updatedCategory = { ...category, color: newColor };
                dispatch(updateCategory(updatedCategory));
              }}
            >
              <IonIcon icon={colorPalette} />
            </IonButton>
            <IonButton color="dark" fill="clear"
              onClick={(e) => {
                e.stopPropagation();
                e.persist();
                setPopoverState({isOpen: true, event: e})
              }}
            >
              <IonIcon icon={menu} />
            </IonButton>
            <IonPopover
              isOpen={popoverState.isOpen}
              event={popoverState.event}
              onDidDismiss={() => setPopoverState({ isOpen: false, event: undefined })}
            >
              <IonContent>
                <IonList>
                  <IonItem onClick={(e) => {
                    e.stopPropagation();
                    setPopoverState({ isOpen: false, event: undefined })
                    setEditModalOpen(true);
                  }}>
                    <IonIcon icon={pencil} slot="start" />
                    <IonLabel>Modifier</IonLabel>
                  </IonItem>
                  <IonItem
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopoverState({ isOpen: false, event: undefined })
                      setDeleteAlertOpen(true);
                    }}
                  >
                    <IonIcon icon={trash} slot="start" />
                    <IonLabel>Supprimer</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
            <IonModal
              isOpen={isEditModalOpen}
              onDidPresent={() => setCategoryNewName(category.name)}
            >
              <div className="flex flex-col justify-start">
                <h3 className="mx-4 mt-4 text-2xl font-bold dark:text-gray-50">
                  Nom de la catégorie
                </h3>
                <IonItem>
                  <IonLabel position="stacked">Nom</IonLabel>
                  <IonInput
                    value={categoryNewName}
                    onIonChange={e => setCategoryNewName(e.detail.value)}
                  />
                </IonItem>
                <div className="flex flex-col mt-2">
                  <IonButton disabled={categoryNewName == ''} onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateCategory({ ...category, name: categoryNewName }));
                    setEditModalOpen(false);
                    setCategoryNewName('');
                  }}>Modifier</IonButton>
                  <IonButton fill="clear" onClick={(e) => {
                    e.stopPropagation();
                    setEditModalOpen(false);
                  }}>Annuler</IonButton>
                </div>
              </div>
            </IonModal>
            <IonAlert
              isOpen={isDeleteAlertOpen}
              onDidDismiss={() => setDeleteAlertOpen(false)}
              header={`Supprimer "${category.name}" ?`}
              buttons={[
                {
                  text: 'Annuler',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Ok',
                  handler: () => {
                    // Checking if category has notes
                    if (nbNotes !== 0) {
                      openToast(`La catégorie contient ${nbNotes} notes. Supprimez les notes puis réessayez.`);
                      return;
                    }
                    else
                      dispatch(deleteCategory(category));
                  }
                },
              ]}
            />
          </div>
        </div>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{message}</p>
      </div>
    </Card>
  )
}

const categoryNames: string[] = [
  'Courses 🛒',
  'Shopping 🛍️',
  'Épargne 💰',
  'Sorties ✈️',
  'Professionnel 👝',
  'Famille 🧑‍🍼',
  'Lifestyle 💚',
  'Alimentation 🍅🍞',
  'Voiture 🚗',
  'Workout 🏋️',
  'Health 🏥',
  'Prévisions 📈'
];

const colors: string[] = [
  '#12bcd5',
  '#a32b1c',
  '#5ba65a',
  '#c67ade',
  '#574aef',
  '#E40e34',
  '#420ea4',
];

export const defaultCategoryColor = 'var(--ion-color-light)';

const nextColor = (color: string): string => {
  const index = colors.findIndex(it => it == color);
  const nbColors = colors.length;
  if (index > -1)
    return colors[(index + 1)%nbColors]
  else
    return colors[Math.floor(Math.random() * 100) % nbColors]
}

const CategoryPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { state, dispatch } = useContext(AppContext);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ newCategoryName, setNewCategoryName ] = useState('');
  const [ newCategoryColor, setNewCategoryColor ] = useState('');
  const [ isToastOpen, setToastOpen ] = useState(false);
  const [ toastMessage, setToastMessage ] = useState('');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Catégories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        { state.categories.sort((a, b) => {
          if (a.name < b.name)
            return false;
          else
            return true;
        }).map(category => {
          const nbNotes = state.notes.filter(it => it.categoryId === category.id).length;
          return <CategoryCard
            key={category.id}
            category={category}
            nbNotes={nbNotes}
            history={history}
            openToast={(message: string) => {
              setToastMessage(message);
              setToastOpen(true);
            }}
          />
        })}
        { state.categories.length === 0 && <EmptyListMessage h1="Aucune catégorie" p="Cliquez sur le bouton + pour créer une catégorie" /> }
        <IonFab className="right-8 bottom-8" vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setModalOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setModalOpen(false)}
        >
          <form className="flex flex-col justify-start">
            <h3 className="mx-4 mt-4 text-2xl font-bold dark:text-gray-50">
              Nouvelle catégorie
            </h3>
            <IonItem>
              <IonLabel position="stacked">Nom</IonLabel>
              <IonInput
                value={newCategoryName}
                placeholder={categoryNames[Math.round(Math.random()*100%categoryNames.length)]}
                onIonChange={e => setNewCategoryName(e.detail.value)}
              />
            </IonItem>
            <div className="flex flex-row justify-evenly w-full py-4">
              { colors.map(color => <ColoredRadio key={color} name="new-category-color" color={color} trigger={setNewCategoryColor} />) }
            </div>
            <div className="flex flex-col mt-2">
              <IonButton onClick={() => {
                if (newCategoryName == '' || newCategoryColor == '')
                  return
                setModalOpen(false);
                setNewCategoryName('');
                setNewCategoryColor('');
                dispatch(addCategory({
                  id: uuid(),
                  name: newCategoryName,
                  color: newCategoryColor
                }));
              }}>Créer</IonButton>
              <IonButton fill="clear" onClick={() => setModalOpen(false)}>Annuler</IonButton>
            </div>
          </form>
        </IonModal>
        <IonToast
          isOpen={isToastOpen}
          message={toastMessage}
          duration={3000}
          color="danger"
          onDidDismiss={() => setToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  )
}

export default CategoryPage;