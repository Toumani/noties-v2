import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";

import {
  IonAlert,
  IonButton,
  IonContent, IonFab, IonFabButton,
  IonHeader,
  IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonModal,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar, useIonViewDidEnter,
} from "@ionic/react";

import {AppContext} from "../../store/State";
import Card from "../ui/Card";
import {pencil, trash, colorPalette, menu, add} from "ionicons/icons";
import ColoredRadio from "../ui/ColoredRadio";
import {Category} from "../../pages/api/categories";
import axios from "axios";

interface CategoryCardProps {
  category: Category,
  nbNotes: number,
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, nbNotes }) => {
  const [popoverState, setPopoverState] = useState({ isOpen: false, event: undefined });
  const [isEditAlertOpen, setEditAlertOpen] = useState(false);
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
      className="mx-auto my-4"
    >
      <div className="h-2 rounded-t-full" style={{ backgroundColor: category.color }}></div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{category.name}</h2>
          <div className="flex flex-row justify-end items-center">
            <IonButton color="dark" fill="clear">
              <IonIcon icon={colorPalette} />
            </IonButton>
            <IonButton color="dark" fill="clear"
              onClick={(e) => {
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
                  <IonItem onClick={() => {
                    setPopoverState({ isOpen: false, event: undefined })
                    setEditAlertOpen(true);
                  }}>
                    <IonIcon icon={pencil} slot="start" />
                    <IonLabel>Modifier</IonLabel>
                  </IonItem>
                  <IonItem
                    color="danger"
                    onClick={() => {
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
            <IonAlert
              isOpen={isEditAlertOpen}
              onDidDismiss={() => setEditAlertOpen(false)}
              header={"Nom de la catégorie"}
              inputs={[
                {
                  name: 'title',
                  type: 'text',
                  value: category.name
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
                  handler: () => { console.log('Updating category'); }
                },
              ]}
            />
            <IonAlert
              isOpen={isDeleteAlertOpen}
              onDidDismiss={() => setDeleteAlertOpen(false)}
              header={`Supprimer "${category.name}" ?`}
              message="Les notes ne seront pas supprimées"
              buttons={[
                {
                  text: 'Annuler',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Ok',
                  handler: () => { console.log('Updating category'); }
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

const CategoryPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { state } = useContext(AppContext);
  const [ categories, setCategories ] = useState<Category[]>([])
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ newCategoryName, setNewCategoryName ] = useState('');
  // const [ newCategoryColor, setNewCaregoryColor ] = useState('#ffffff');

  useIonViewDidEnter(() => {
    axios
      .get('/api/categories')
      .then((res) => {
        setCategories(res.data)
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
          <IonTitle>Catégories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        { categories.map(category => {
          const nbNotes = state.notes.filter(it => it.category.id === category.id).length;
          return <CategoryCard key={category.color} category={category} nbNotes={nbNotes} />
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
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
              { colors.map(color => <ColoredRadio key={color} name="new-category-color" color={color} />) }
            </div>
            <div className="flex flex-col mt-2">
              <IonButton onClick={() => setModalOpen(false)}>Créer</IonButton>
              <IonButton fill="clear" onClick={() => setModalOpen(false)}>Annuler</IonButton>
            </div>
          </form>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default CategoryPage;