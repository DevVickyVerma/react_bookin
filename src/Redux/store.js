import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import sidebarReducer from './sidebarSlice';

const store = configureStore({
  reducer: {
    data: dataReducer,
    sidebar: sidebarReducer,
  },
});

export default store;

