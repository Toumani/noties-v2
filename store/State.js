import React, { createContext, useReducer } from "react";

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

export const addCategory = (category) => ({
  type: 'ADD_CATEGORY',
  category
});

export const updateCategory = (category) => ({
  type: 'UPDATE_CATEGORY',
  category
})

export const deleteCategory = (category) => ({
  type: 'DELETE_CATEGORY',
  category
});

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

const reducer = (state, action) => {
  const categoriesUpdated = [];
  const notesUpdated = [];
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      }
    case 'ADD_NOTE':
      state.notes.push(action.data);
      return state;
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(it => it.id !== action.data.id)
      };
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      }
    case 'ADD_CATEGORY':
      state.categories.push(action.category);
      return state;
    case 'UPDATE_CATEGORY':
      state.categories.forEach(it => {
        if (it.id === action.category.id)
          categoriesUpdated.push(action.category);
        else
          categoriesUpdated.push(it)
      });
      return {
        ...state,
        categories: categoriesUpdated
      };
    case 'DELETE_CATEGORY':
      state.categories.forEach(it => {
        if (it.id !== action.category.id) {
          categoriesUpdated.push(it)
        }
      })
      return {
        ...state,
        categories: categoriesUpdated
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      }
    case 'LOG_OUT':
      return {
        ...state,
        user: undefined,
      };
    default: return state;
  }
}

const persistedReducer = (state, action) => {
  const newState = reducer(state, action);
  if (typeof window !== 'undefined')
    localStorage.setItem('persistedState', JSON.stringify(newState));
  return newState;
}

function AppContextProvider(props) {
  const fullInitialState = {
    ...initialState,
    ...persistedState,
  }

  let [state, dispatch] = useReducer(persistedReducer, fullInitialState);
  let value = { state, dispatch };

  return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };