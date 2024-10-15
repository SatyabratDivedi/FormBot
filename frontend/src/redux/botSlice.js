import { createSlice } from "@reduxjs/toolkit";

export const botSlice = createSlice({
  name: "botName",
  initialState: {
    data: JSON.parse(localStorage.getItem('storeBot')) || {},
  },
  reducers: {
    setBot: (state, action) => {
      localStorage.setItem('storeBot', JSON.stringify(action.payload))
      state.data = action.payload;
    },
  },
});

export const { setBot } = botSlice.actions;
export default botSlice.reducer;