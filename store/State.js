import React, {createContext, useReducer} from "react";

let AppContext = createContext();

const initialState = {
  // mock
  notes: [
    {
      id: 1,
      title: 'Marché express mai 2022',
      category: { name: 'Courses 🛒', color: '#12bcd5' },
      nbElementDone: 4,
      nbElement: 10,
      author: 'Kenza',
      tasks: [
        { title: 'Tomates 🍅', index: 0, done: false },
        { title: 'Bananes 🍌', index: 1, done: true },
        { title: 'Pommes 🍏', index: 2, done: false },
        { title: 'Viande 🥩', index: 3, done: false },
        { title: 'Avocat 🥑', index: 4, done: false },
        { title: 'Viénoiseries 🥐', index: 5, done: true },
        { title: 'Pommes de terre 🥔', index: 6, done: false },
        { title: 'Raisins 🍇', index: 7, done: true },
        { title: 'Ail 🧄', index: 8, done: false },
        { title: 'Pâtes 🍝', index: 9, done: true },
      ]
    },
    {
      id: 2,
      title: 'Épargne mensuelle',
      category: { name: 'Épargne 💰', color: '#5ba65a' },
      nbElementDone: 4,
      nbElement: 4,
      author: 'Kenza',
      tasks: [
        { title: 'Décembre 2021 : 2500', index: 0, done: true },
        { title: 'Janvier 2022 : 2300', index: 1, done: true },
        { title: 'Février 2022 : 3000', index: 2, done: true },
        { title: 'Mars 2022 : 2500', index: 3, done: true },
      ]
    },
    {
      id: 3,
      title: 'Course Shein',
      category: { name: 'Shopping 🛍️', color: '#a32b1c' },
      nbElementDone: 3,
      nbElement: 7,
      author: 'Kenza',
      tasks: [
        { title: 'Haut jaune 🎽', index: 0, done: false },
        { title: 'Sandale plage 🩴', index: 1, done: false },
        { title: 'Collier de perles 📿', index: 2, done: true },
        { title: 'Ceinture', index: 3, done: false },
        { title: 'Basket 👟', index: 4, done: false },
        { title: 'Chapeau 👒', index: 5, done: true },
        { title: 'Guitare 🎸', index: 6, done: true },
      ]
    },
  ]
}

let persistedState = {}
if (typeof window !== "undefined")
  persistedState = window.localStorage['persistedState'] !== undefined ? JSON.parse(window.localStorage['persistedState']) : {};

let reducer = (state, action) => {
  switch (action.type) {
    default: return state;
  }
}

function AppContextProvider(props) {
  const fullInitialState = {
    ...initialState,
    ...persistedState,
  }

  let [state, dispatch] = useReducer(reducer, fullInitialState);
  let value = { state, dispatch };

  return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };