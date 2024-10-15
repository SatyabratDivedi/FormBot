import { createSlice } from "@reduxjs/toolkit";

export const botUpdateSlice = createSlice({
  name: "botUpdate",
  initialState: {
    updateData: {},
  },
  reducers: {
    setBotUpdate: (state, action) => {
      state.updateData = action.payload;
    },
  },
});

export const { setBotUpdate } = botUpdateSlice.actions;
export default botUpdateSlice.reducer;