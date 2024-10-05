import {useCallback, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate, NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RxCross2} from "react-icons/rx";
import toast from "react-hot-toast";
import {setBot} from "../../redux/botSlice";
import style from "./workSpaceAera.module.css";
import BotPage from "../botPage/BotPage";
import ThemePage from "../themePage/ThemePage";
import ResponsePage from "../responsePage/ResponsePage";
import {setBotUpdate} from "../../redux/botUpdateSlice";

const WorkSpaceArea = ({isBotSaved}) => {
  const data = useSelector((store) => store?.botReducer?.data);
  const updateData = useSelector((store) => store?.botUpdateReducer?.updateData);
  console.log(updateData);
  const [botDetails, setBotDetails] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folderName = decodeURI(location.pathname.split("/")[2]);
  const mainRoute = location.pathname.split("/")[3];
  let botName = decodeURI(location.pathname.split("/")[4]);

  const hasChanges = () => {
    if (botDetails?.length == 0 || updateData.botArr?.length == 0 || Object.keys(updateData)?.length == 0) return false;
    const isBotDetailsChanged = JSON.stringify(botDetails[0]) !== JSON.stringify(updateData);
    return isBotDetailsChanged;
  };

  const botArrSaveHandler = async () => {
    if (!data.botName) return toast.error("please enter bot name");
    console.log(data);
    try {
      const res = await fetch("http://localhost:3000/api/save_bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({data, folder: folderName}),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(result.msg, {duration: 1000});
        localStorage.removeItem("storeBot");
        navigate(`/folder/${folderName}`);
      }
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error);
      navigate("/");
    }
  };

  const botNameHandler = (e) => {
    const newBotName = e.target.value;
    console.log('newBotName: ', newBotName);
    if (isBotSaved) {
        console.log(newBotName)
        const updatedData = {...updateData, botName: newBotName};
        dispatch(setBotUpdate(updatedData));
    } else {
      const arrData = JSON.parse(localStorage.getItem("storeBot")) || {};
      console.log(arrData);
      arrData.botName = newBotName;
      localStorage.setItem("storeBot", JSON.stringify(arrData));
      dispatch(setBot(arrData));
      console.log(arrData);
    }
  };

  const fetchFolderFn = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/get_folder_details", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        setTimeout(() => {
          toast.error("you need to login first", {duration: 1000});
          navigate("/login");
        }, 500);
      } else {
        const currentFolder = result.allFolder.find((folder) => folder.folderName === folderName); //here
        const currentBot = currentFolder?.allBots.find((bot) => bot.botName === botName);
        setBotDetails(currentBot ? [currentBot] : []);
        setSkeleton(false);
      }
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error.message);
      navigate("/");
    }
  }, [navigate, folderName, botName]);

  const updateBotHandler = async () => {
    const toastId = toast.loading('...updating')
    try {
      const res = await fetch(`http://localhost:3000/api/bot_update/${updateData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      const result = await res.json();
      console.log("result: ", result);
      if (res.ok) {
        toast.success(result.msg, {id:toastId})
        navigate(`/folder/${folderName}`)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, [fetchFolderFn]);

  return (
    <div className={style.workSpaceMainContainer}>
      <header>
        <div className={style.left}>
          <input
            value={isBotSaved ? updateData.botName : data.botName}
            style={{visibility: mainRoute === "response" ? "hidden" : "visible"}}
            type="text"
            onChange={botNameHandler}
            placeholder="Enter Form Name"
          />
        </div>
        <div className={style.center}>
          <NavLink to={isBotSaved ? `/folder/${folderName}/bot/${botName}` : `/folder/${folderName}/bot`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
            Bot
          </NavLink>
          <NavLink to={isBotSaved ? `/folder/${folderName}/theme/${botName}` : `/folder/${folderName}/theme`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
            Theme
          </NavLink>
          <NavLink to={isBotSaved ? `/folder/${folderName}/response/${botName}` : `/folder/${folderName}/response`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
            Response
          </NavLink>
        </div>
        <div className={style.right}>
          {isBotSaved ? (
            <button
              onClick={updateBotHandler}
              className={hasChanges() ? style.updateBtn : style.notUpdateBtn}
              style={{
                cursor: hasChanges() ? "pointer" : "not-allowed",
              }}
            >
              Update
            </button>
          ) : (
            <button
              onClick={data.botArr?.length !== 0 && data.botName?.length !== 0 && botArrSaveHandler}
              className={data.botArr?.length !== 0 && data.botName?.length !== 0 ? style.saveBtn : style.notUpdateBtn}
              style={{
                cursor: data.botArr?.length !== 0 && data.botName?.length !== 0 ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          )}
          <div onClick={() => navigate("/folder/main")} style={{color: "#F55050", transform: "translateY(3px)", fontSize: "1.4rem", cursor: "pointer"}}>
            <RxCross2 />
          </div>
        </div>
      </header>
      {mainRoute === "bot" && <BotPage isBotSaved={isBotSaved} botDetails={botDetails} skeleton={skeleton} />}
      {mainRoute === "theme" && <ThemePage isBotSaved={isBotSaved} botDetails={botDetails} />}
      {mainRoute === "response" && <ResponsePage isBotSaved={isBotSaved} />}
      <Outlet />
    </div>
  );
};

export default WorkSpaceArea;
