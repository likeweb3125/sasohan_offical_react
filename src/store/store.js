import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
// @ts-ignore
import { encryptTransform } from 'redux-persist-transform-encrypt';
import user from './userSlice';
import common from './commonSlice';
import popup from './popupSlice';
import etc from './etcSlice';
import landing from './landingSlice';

// 저장소 버전 설정
const CURRENT_STORAGE_VERSION = 'v1'; 

// 버전 확인 및 초기화
const checkAndMigrateStorage = () => {
  const savedVersion = localStorage.getItem('storage_version');
  if (savedVersion !== CURRENT_STORAGE_VERSION) {
    localStorage.clear();
    localStorage.setItem('storage_version', CURRENT_STORAGE_VERSION);
  }
};

// 저장소 버전 확인
checkAndMigrateStorage();

const reducers = combineReducers({
  user: user.reducer,
  common: common.reducer,
  popup: popup.reducer,
  etc: etc.reducer,
  landing: landing.reducer,
});

// 암호화 변환 설정
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_ENCRYPT_KEY || 'default-secret-key', // 환경 변수로 비밀키 설정
  onError: function (error) {
    console.error('Encryption error:', error);
  }
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user','etc'],
  transforms: [encryptor]  // 암호화 변환기 적용
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;