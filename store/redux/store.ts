import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk'
import kidsSlice from "./kids";


const rootReducer = combineReducers({
  kids: kidsSlice,
});

const monitorMiddleware = (storeAPI: { getState: () => any; }) => (next: (arg0: any) => any) => (action: any) => {
  console.log('Action Size:', JSON.stringify(action).length);
  console.log('State Size:', JSON.stringify(storeAPI.getState()).length);
  return next(action);
};

// Create the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 100, // Increase the warning threshold from 32ms to 100ms
      },
      immutableCheck: {
        warnAfter: 64, // Increase the threshold (in milliseconds)
      },
    }).concat(monitorMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;

// Define the type for the dispatch function
export type AppDispatch = typeof store.dispatch;
export default store;