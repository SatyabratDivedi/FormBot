import {configureStore} from "@reduxjs/toolkit";
import botReducer from "./botSlice";
import loginReducer from "./isLoginSlice";
import botUpdateReducer from "./botUpdateSlice";

export default configureStore({
  reducer: {botReducer, loginReducer, botUpdateReducer},
});
