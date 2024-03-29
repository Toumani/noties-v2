import React, { createContext, useReducer } from "react";

let AppContext = createContext();

const initialState = {
  notes: [],
  categories: [],
  settings: {
    darkMode: true,
  },
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
    // Session
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      }
    case 'LOG_OUT':
      return {
        ...state,
        user: undefined,
      };

    // Categories
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

    // Notes
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

    // Task
    case 'ADD_TASK':
      state.notes.forEach(note => {
        if (note.id === action.data.note.id)
          note.tasks.push(action.data.task);
        notesUpdated.push(note);
      });
      return {
        ...state,
        notes: notesUpdated
      }
    case 'UPDATE_TASK':
      state.notes.forEach(note => {
        if (note.id === action.data.note.id) {
          const task = note.tasks.find(it => it.id === action.data.task.id);
          task.title = action.data.task.title;
          task.done = action.data.task.done;
          task.index = action.data.task.index;
        }
        notesUpdated.push(note);
      });
      return {
        ...state,
        notes: notesUpdated
      }
    case 'DELETE_TASK':
      state.notes.forEach(note => {
        if (note.id === action.data.note.id)
          note.tasks = note.tasks.filter(it => it.id !== action.data.task.id);
        notesUpdated.push(note);
      })
      return {
        ...state,
        notes: notesUpdated
      }

    // Settings
    case 'SET_DARK_MODE':
      return {
        ...state,
        settings: {
          ...state.settings,
          darkMode: action.data
        }
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