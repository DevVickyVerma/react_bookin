import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const catDataSlice = createSlice({
  name: "catData",
  initialState,
  reducers: {
    setFact: (state, { payload }) => {
      const parsedPayload = JSON.parse(payload);
      const newState = { ...state };
      newState.data = parsedPayload;
      return newState;
    },
  },
});

export const { setFact } = catDataSlice.actions;

export default catDataSlice.reducer;
