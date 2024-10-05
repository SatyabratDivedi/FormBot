import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from "./components/registerAndLogin/Register.jsx";
import MainDashboard from "./components/mainDashboard/MainDashboard.jsx";
import Login from "./components/registerAndLogin/Login.jsx";
import Folders from "./components/foldersPage/Folders.jsx";
import WorkSpaceArea from "./components/workSpace/WorkSpaceArea.jsx";
import {Provider} from "react-redux";
import store from "./redux/store.js";
import {Toaster} from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import Folders_skeleton from "./components/foldersPage/Folders_skeleton.jsx";
import ChatBotPage from "./components/chatBotPage/ChatBotPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainDashboard />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/skeleton",
        element: <Folders_skeleton />,
      },
      {
        path: "/folder/:folderName",
        element: <Folders />,
      },
      {
        path: "/folder/:folderName/bot",
        element: <WorkSpaceArea />,
      },
      {
        path: "/folder/:folderName/bot/:botName",
        element: <WorkSpaceArea isBotSaved={true} />,
      },
      {
        path: "/folder/:folderName/theme",
        element: <WorkSpaceArea />,
      },
      {
        path: "/folder/:folderName/theme/:botName",
        element: <WorkSpaceArea isBotSaved={true} />,
      },
      {
        path: "/folder/:folderName/response",
        element: <WorkSpaceArea />,
      },
      {
        path: "/folder/:folderName/response/:botName",
        element: <WorkSpaceArea isBotSaved={true} />,
      },
      {
        path: "/share_bot",
        element: <ChatBotPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster />
  </Provider>
);
