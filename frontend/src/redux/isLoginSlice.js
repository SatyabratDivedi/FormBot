import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "loginName",
  initialState: {
    isLogin: false,
  },
  reducers: {
    storeIsLogin: (state, action) => {
      console.log(action.payload)
      state.isLogin = action.payload;
    },
  },
});

export const { storeIsLogin } = loginSlice.actions;
export default loginSlice.reducer;
