import React, { createContext, useReducer } from "react";

const MainContext = createContext(undefined);

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const mainReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }

    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const MainProvider = ({ children }) => {
  const initialState = { latLong: "", coffeeStores: [] };

  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider, MainContext };
