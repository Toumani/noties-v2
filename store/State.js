import React, {createContext, useReducer} from "react";

let AppContext = createContext();

const initialState = {
  // mock
  notes: [
    { title: 'Marché express mai 2022', category: {name: 'Courses', color: '#12bcd5'}, nbElementDone: 0, nbElement: 1, author: 'Kenza' },
    { title: 'Épargne mensuelle', category: {name: 'Épargne', color: '#5ba65a' }, nbElementDone: 10, nbElement: 10, author: 'Kenza' },
    { title: 'Course Shein', category: {name: 'Shopping', color: '#a32b1c' }, nbElementDone: 3, nbElement: 7, author: 'Kenza' },
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