import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "loginName",
  initialState: {
    isLogin: false,
  },
  reducers: {
    storeIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { storeIsLogin } = loginSlice.actions;
export default loginSlice.reducer;
