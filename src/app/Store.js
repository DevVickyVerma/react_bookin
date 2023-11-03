import { configureStore } from "@reduxjs/toolkit";
import catDataReducer from "./catDataSlice";

export const store = configureStore({
  reducer: {
    catData: catDataReducer,
  },
});
