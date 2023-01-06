import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";

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
  IonToolbar, useIonViewDidEnter,
} from "@ionic/react";

import {AppContext, setCategories} from "../../store/State";
import Card from "../ui/Card";
import {pencil, trash, colorPalette, menu, add} from "ionicons/icons";
import ColoredRadio from "../ui/ColoredRadio";
import {Category} from "../../pages/api/categories";
import axios from "axios";
import {API_URL} from "../../lib/constants";

interface CategoryCardProps {
  category: Category,
  update: () => void,
  history: RouteComponentProps,
  openToast: (string) => void,
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, update, openToast, history }) => {
  const [popoverState, setPopoverState] = useState({ isOpen: false, event: undefined });
  const [isEditAlertOpen, setEditAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  let message: string;
  if (category.nbNotes == 0)
    message = 'Aucune note';
  else if (category.nbNotes == 1)
    message = '1 note';
  else
    message = category.nbNotes + ' notes';

  return (
    <Card
      className="mx-auto my-4 cursor-pointer"
      onClick={() => history.push(`/tabs/notes?categoryId=${category.id}`)}
    >
      <div className="h-2 rounded-t-full" style={{ backgroundColor: category.color }}></div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{category.name}</h2>
          <div className="flex flex-row justify-end items-center">
            <IonButton color="dark" fill="clear"
              onClick={() => {
                axios
                  .put(`${API_URL}categories`, { id: category.id, color: nextColor(category.color)})
                  .then(update)
              }}
            >
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
                  handler: (data) => {
                    axios
                      .put(`${API_URL}categories`, { id: category.id, name: data.title})
                      .then(update)
                  }
                },
              ]}
            />
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
                    axios.delete(`${API_URL}categories/${category.id}`)
                      .then(update)
                      .catch(error => {
                        if (error.response.status === 409)
                          openToast(`La catégorie contient ${error.response.data.nbNotes} notes. Supprimez les notes puis réessayez.`)
                      })
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

const nextColor = (color: string) => {
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
  const [ newCategoryColor, setNewCaregoryColor ] = useState('');
  const [ isToastOpen, setToastOpen ] = useState(false);
  const [ toastMessage, setToastMessage ] = useState('');

  const fetchCategories = () => {
    axios
      .get(API_URL + 'categories')
      .then((res) => {
        dispatch(setCategories(res.data))
      })
      .catch(error => {
        if (error.response.status === 401)
          history.push('/login')
      })
  }

  useIonViewDidEnter(fetchCategories)

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
          return <CategoryCard
            key={category.id}
            category={category}
            update={fetchCategories}
            history={history}
            openToast={(message: string) => {
              setToastMessage(message);
              setToastOpen(true);
            }}
          />
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
              { colors.map(color => <ColoredRadio key={color} name="new-category-color" color={color} trigger={setNewCaregoryColor} />) }
            </div>
            <div className="flex flex-col mt-2">
              <IonButton onClick={() => {
                if (newCategoryName == '' || newCategoryColor == '')
                  return
                axios
                  .post(`${API_URL}categories`, {
                    name: newCategoryName,
                    color: newCategoryColor
                  })
                  .then((res) => {
                    fetchCategories()
                    setModalOpen(false)
                  })
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