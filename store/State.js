import React, {createContext, useReducer} from "react";

let AppContext = createContext();

const initialState = {
  // mock
  user: {
    name: 'Kenza'
  },
  notes: [],
  categories: [
    { id: 1, name: 'Courses 🛒', color: '#12bcd5' },
    { id: 2, name: 'Shopping 🛍️', color: '#a32b1c' },
    { id: 3, name: 'Épargne 💰', color: '#5ba65a' },
    { id: 4, name: 'Sorties ✈️', color: '#c67ade' },
  ]
}

let persistedState = {}
if (typeof window !== "undefined")
  persistedState = window.localStorage['persistedState'] !== undefined ? JSON.parse(window.localStorage['persistedState']) : {};

export const setNotes = (notes) => {
  return {
    type: 'SET_NOTES',
    notes
  }
}

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      }
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