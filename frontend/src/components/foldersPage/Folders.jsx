import {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import style from "./folders.module.css";
import {HiOutlineFolderPlus} from "react-icons/hi2";
import {RiDeleteBin6Line} from "react-icons/ri";
import {NavLink, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import Folders_skeleton from "./Folders_skeleton";
import icon from "./../../assets/icon.png";
import {setBotUpdate} from "../../redux/botUpdateSlice";
import {useDispatch} from "react-redux";
import Cookies from 'js-cookie';

const Folders = () => {
  const tokenId = Cookies.get('tokenId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFolderDelete, setShowFolderDelete] = useState({display: false, folderId: ""});
  const [folderName, setFolderName] = useState("");
  const [foldersArr, setFoldersArr] = useState();
  const [skeleton, setSkeleton] = useState(true);
  const params = useParams();
  const [userName, setUserName] = useState();

  const folderInputHandler = () => {
    if (folderName === "") return;
    const alreadyExists = foldersArr.map((folder) => folder.folderName).some((folder) => folder === folderName);
    if (alreadyExists) {
      alert("Folder name is already exists");
      return;
    }
    console.log("first");
    setFoldersArr([...foldersArr, {folderName: folderName.trim()}]);
    setShowCreateFolder(false);
    saveFolderFn();
    setFolderName("");
  };

  const fetchFolderFn = useCallback(async () => {
    try {
      const res = await fetch("https://form-bot-backend1.vercel.app/api/get_folder_details", {
        method: "GET",
        headers: {
          'Authorization': tokenId,
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
        setUserName(result.user.name);
        setFoldersArr(result.allFolder);
        console.log(result.allFolder);
        setSkeleton(false);
      }
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error.message);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchFolderFn();
  }, [fetchFolderFn]);

  const saveFolderFn = async () => {
    console.log("first");
    try {
      await fetch("https://form-bot-backend1.vercel.app/api/create_folder", {
        method: "POST",
        headers: {
          'Authorization': tokenId,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({folderName}),
      });
      fetchFolderFn();
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error.message);
      navigate("/");
    }
  };

  const deleteFolderHandler = async (folderId) => {
    try {
      const res = await fetch(`https://form-bot-backend1.vercel.app/api/delete_folder/${folderId}`, {
        method: "DELETE",
        headers: {
          'Authorization': tokenId,
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      toast.error(error.message, {duration: 400});
    }
  };

  const botArrFn = useCallback(() => {
    if (foldersArr) {
      const botArr = foldersArr?.filter((folder) => folder.folderName == params.folderName);
      return botArr[0].allBots.map((bot) => bot);
    }
  }, [foldersArr, params.folderName]);

  useEffect(() => {
    localStorage.setItem('storeBot', JSON.stringify({ botName: '', theme: 'light', botArr: [] }))
    botArrFn();
    dispatch(setBotUpdate({}));
  }, [botArrFn]);

  return (
    <>
      {skeleton ? (
        <Folders_skeleton />
      ) : (
        <div
          className={style.mainPage}
          onClick={() => {
            showCreateFolder && setShowCreateFolder(!showCreateFolder);
            showFolderDelete && setShowFolderDelete(!showFolderDelete);
          }}
        >
          <header>
            <div onClick={() => navigate("/")} className={style.formBotHeader}>
              <img src={icon} alt="" />
              <div>FormBot</div>
            </div>
            <div className={style.nameSpace}>Hi👋🏻 {userName}</div>
          </header>
          <div className={style.folderBoxContainer}>
            <div
              className={style.folderBox}
              onClick={() => {
                setShowCreateFolder(!showCreateFolder);
                setShowFolderDelete({display: false});
              }}
            >
              <HiOutlineFolderPlus /> Create a folder
            </div>
            {foldersArr?.map((folder) => (
              <NavLink key={folder._id} to={`/folder/${folder.folderName}`} className={({isActive}) => `${isActive && style.activeBackground} ${style.folderBox}`}>
                {folder.folderName}
                {folder.folderName !== "main" && (
                  <RiDeleteBin6Line
                    className={style.deleteButton}
                    onClick={() => {
                      setShowFolderDelete({display: true, folderId: folder._id});
                    }}
                  />
                )}
              </NavLink>
            ))}
          </div>
          <div className={style.boxContainer}>
            <Link to={`/folder/${params.folderName}/bot`} className={style.box}>
              <div style={{fontSize: "4rem", paddingBottom: "16px"}}>+</div>
              <div style={{fontSize: "19px", fontWeight: "400"}}>Create a typebot</div>
            </Link>
            {botArrFn().map((bot) => (
              <Link to={`/folder/${params.folderName}/bot/${bot.botName}/${bot._id}`} key={bot.botName} className={style.box}>
                <div style={{fontSize: "19px", fontWeight: "400"}}>{bot.botName}</div>
              </Link>
            ))}
          </div>
          {/* add folder popup */}
          {showCreateFolder && (
            <div onClick={(e) => e.stopPropagation()} className={style.addFolderPopup}>
              <h1>Create a folder</h1>
              <input onChange={(e) => setFolderName(e.target.value)} value={folderName} type="text" autoFocus placeholder="Enter folder name" />
              <div className={style.cancelCreateBtn}>
                <button onClick={folderInputHandler} style={{color: "#4B83FF"}}>
                  Done
                </button>
                <div className={style.stand}>|</div>
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* delete folder popup */}
          {showFolderDelete.display && (
            <div className={style.addFolderPopup}>
              <h1 style={{textAlign: "center"}}>Are you sure you want to delete this folder ? {showFolderDelete.index}</h1>
              <div className={style.cancelCreateBtn}>
                <button
                  style={{color: "#4B83FF"}}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFolderDelete({display: false});
                    const findIndex = foldersArr.findIndex((folder) => folder._id == showFolderDelete.folderId);
                    foldersArr.splice(findIndex, 1);
                    navigate("/folder/main");
                    deleteFolderHandler(showFolderDelete.folderId);
                  }}
                >
                  Confirm
                </button>
                <div className={style.stand}>|</div>
                <button
                  onClick={() => {
                    setShowFolderDelete({display: false});
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Folders;
