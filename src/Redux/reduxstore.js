import { configureStore } from '@reduxjs/toolkit';
import apiResponseReducer from './apiResponseSlice';

const store = configureStore({
  reducer: {
    apiResponse: apiResponseReducer,
  },
});

export default store;
