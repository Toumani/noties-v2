import React, {createContext, useReducer} from "react";

let AppContext = createContext();

const initialState = {
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

export const setUser = user => {
  return {
    type: 'SET_USER',
    user,
  }
}

export const logOut = () => {
  return {
    type: 'LOG_OUT'
  }
}

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('persistedState', JSON.stringify({ user: action.user }))
      return {
        ...state,
        user: action.user,
      }
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
    case 'LOG_OUT':
      if (typeof window !== "undefined")
        window.localStorage.removeItem('persistedState');
      return initialState;
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