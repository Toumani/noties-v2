import React, {createContext, useReducer} from "react";

let AppContext = createContext();

const initialState = {
  // mock
  user: {
    name: 'Kenza'
  },
  notes: [],
  categories: []
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

export const setCategories = (categories) => {
  return {
    type: 'SET_CATEGORIES',
    categories
  }
}

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
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