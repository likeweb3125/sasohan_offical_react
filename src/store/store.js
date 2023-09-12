import { configureStore } from '@reduxjs/toolkit';
import user from './userSlice';
import common from './commonSlice';
import popup from './popupSlice';

export default configureStore({
  reducer: { 
    user: user.reducer,
    popup: popup.reducer,
    common: common.reducer,
  }
});