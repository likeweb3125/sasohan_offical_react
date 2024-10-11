import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
// import sessionStorage from 'redux-persist/es/storage/session';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import user from './userSlice';
import common from './commonSlice';
import popup from './popupSlice';
import etc from './etcSlice';
import landing from './landingSlice';

const reducers = combineReducers({
  user: user.reducer,
  common: common.reducer,
  popup: popup.reducer,
  etc: etc.reducer,
  landing: landing.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user','etc']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;