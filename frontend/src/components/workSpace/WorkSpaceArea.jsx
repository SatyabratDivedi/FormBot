import {useCallback, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate, NavLink, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RxCross2} from "react-icons/rx";
import toast from "react-hot-toast";
import {setBot} from "../../redux/botSlice";
import style from "./workSpaceAera.module.css";
import BotPage from "../botPage/BotPage";
import ThemePage from "../themePage/ThemePage";
import ResponsePage from "../responsePage/ResponsePage";
import {setBotUpdate} from "../../redux/botUpdateSlice";
import Cookies from 'js-cookie';

const WorkSpaceArea = ({isBotSaved}) => {
  const tokenId = Cookies.get('tokenId');
  const param = useParams();
  const {folderName, botName, botId} = param;
  const data = useSelector((store) => store?.botReducer?.data);
  const updateData = useSelector((store) => store?.botUpdateReducer?.updateData);
  console.log(updateData);
  const [botDetails, setBotDetails] = useState([]);
  const [skeleton, setSkeleton] = useState(isBotSaved);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainRoute = location.pathname.split("/")[3];

  const hasChanges = () => {
    if (botDetails?.length == 0 || updateData.botArr?.length == 0 || Object.keys(updateData)?.length == 0) return false;
    const isBotDetailsChanged = JSON.stringify(botDetails[0]) !== JSON.stringify(updateData);
    return isBotDetailsChanged;
  };

  const botArrSaveHandler = async () => {
    data.botArr?.length !== 0 && data.botName?.length !== 0;
    if (!data.botName) return toast.error("please enter bot name");
    if (data.botArr?.length == 0) return toast.error("bot can't be blanked");
    const toastId = toast.loading("creating...");
    try {
      const res = await fetch("https://form-bot-backend1.vercel.app/api/save_bot", {
        method: "POST",
        headers: {
          "Authorization": tokenId,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({data, folder: folderName}),
      });
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        toast.success(result.msg, {id: toastId, duration: 1000});
        localStorage.removeItem("storeBot");
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(result.msg, {id: toastId, duration: 1000});
      }
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error);
      navigate("/");
    }
  };

  const botNameHandler = (e) => {
    const newBotName = e.target.value;
    console.log("newBotName: ", newBotName);
    if (isBotSaved) {
      console.log(newBotName);
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
      const res = await fetch("https://form-bot-backend1.vercel.app/api/get_folder_details", {
        method: "GET",
        headers: {
          "Authorization": tokenId,
        },
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
    console.log(hasChanges());
    if(!hasChanges()) return toast.error("not any changes", {duration: 700});
    const toastId = toast.loading("updating...");
    try {
      const res = await fetch(`https://form-bot-backend1.vercel.app/api/bot_update/${botId}`, {
        method: "PATCH",
        headers: {
          "Authorization": tokenId,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      const result = await res.json();
      console.log("result: ", result);
      if (res.ok) {
        toast.success(result.msg, {id: toastId, duration: 1000});
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(result.msg, {id: toastId, duration: 1000});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, [fetchFolderFn]);
  const shareBotHandler = () => {
    navigator.clipboard
      .writeText(`http://localhost:5173/share_bot/${botId}`)
      .then(() => toast.success("share link copied"))
      .catch(() => toast.error("something error"));
  };

  const deleteBotHandler = async () => {
    console.log(updateData._id);
    const toastId = toast.loading("deleting...");
    try {
      const res = await fetch(`https://form-bot-backend1.vercel.app/api/bot_delete/${botId}`, {
        method: "DELETE",
        headers: {
          "Authorization": tokenId,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({folderName}),
      });
      const result = await res.json();
      console.log("result: ", result);
      if (res.ok) {
        toast.success(result.msg, {id: toastId});
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(result.msg, {id: toastId});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={style.workSpaceMainContainer}>
      <header>
        <div className={style.left}>
          <input value={isBotSaved ? updateData.botName || botName : data.botName} type="text" onChange={botNameHandler} placeholder="Enter Form Name" />
        </div>
        <div className={style.center}>
          <NavLink to={isBotSaved ? `/folder/${folderName}/bot/${botName}/${botId}` : `/folder/${folderName}/bot`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
            Bot
          </NavLink>
          <NavLink to={isBotSaved ? `/folder/${folderName}/theme/${botName}/${botId}` : `/folder/${folderName}/theme`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
            Theme
          </NavLink>
          {isBotSaved && (
            <NavLink to={`/folder/${folderName}/response/${botName}/${botId}`} className={({isActive}) => `${isActive ? style.botText : ""} ${style.navTxt}`}>
              Response
            </NavLink>
          )}
        </div>
        <div className={style.right}>
          {isBotSaved ? (
            <div className={style.threeBtn}>
              <button onClick={deleteBotHandler} className={style.deleteBtn}>
                Delete
              </button>
              <button onClick={shareBotHandler} className={style.shareBtn}>
                Share
              </button>
              <button onClick={updateBotHandler} className={hasChanges() ? style.updateBtn : style.notUpdateBtn} style={{cursor: hasChanges() ? "pointer" : "not-allowed"}}>
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={botArrSaveHandler}
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
