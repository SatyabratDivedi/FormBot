/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useState} from "react";
import {MdOutlineTextsms} from "react-icons/md";
import {CiImageOn} from "react-icons/ci";
import {FiVideo} from "react-icons/fi";
import {MdGif} from "react-icons/md";
import {PiTextTBold} from "react-icons/pi";
import {MdOutlineNumbers} from "react-icons/md";
import {MdAlternateEmail} from "react-icons/md";
import {IoCallOutline} from "react-icons/io5";
import {CiCalendarDate} from "react-icons/ci";
import {FaRegStar} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import flag from "./../../assets/flag.png";
import style from "./botPage.module.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setBot} from "../../redux/botSlice";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {setBotUpdate} from "../../redux/botUpdateSlice";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const BotPage = ({isBotSaved, skeleton, botDetails}) => {
  const tokenId = Cookies.get('tokenId');
  console.log("isBotSaved: ", isBotSaved);
  const updateData = useSelector((store) => store?.botUpdateReducer?.updateData);
  console.log(updateData);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainFolder = location.pathname.split("/")[2];
  let botName = decodeURI(location.pathname.split("/")[4]);
  console.log("botName: ", botName);
  const localData = JSON.parse(localStorage.getItem("storeBot"));
  console.log(localData);
  const [botArr, setBotArr] = useState(updateData.botArr);
  console.log(botArr);
  const [botData, setBotData] = useState({botName: "", theme: "light", botArr});

  const fetchFolderFn = useCallback(async () => {
    try {
      const res = await fetch(`https://form-bot-backend1.vercel.app/api/bot_details/${mainFolder}/${botName}`, {
        method: "GET",
        headers: {
          'Authorization': tokenId,
        },
        credentials: "include",
      });
      console.log(res);
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        console.log(updateData?.botName);
        console.log(botName);
        if (Object.keys(updateData)?.length == 0) {
          setBotArr(result.botArr);
          console.log(result);
          dispatch(setBotUpdate(result));
        }
      } else {
        toast.error(result.msg);
        navigate(`/folder/${mainFolder}`);
      }
    } catch (error) {
      console.log(error);
    }
  }, [mainFolder, botName]);

  useEffect(() => {
    if (isBotSaved) fetchFolderFn();
  }, [fetchFolderFn]);

  const botClkHandler = (type, category) => {
    setBotArr([...botArr, {type, category, value: ""}]);
  };
  const deleteBotHandler = (i) => {
    setBotArr(botArr.filter((_, index) => index !== i));
  };

  const botInputHandler = (event, i) => {
    setBotArr((prevBot) => {
      return prevBot.map((bot, innerIndex) => {
        if (innerIndex !== i) return bot;
        return {
          ...bot,
          value: event.target.value,
        };
      });
    });
  };

  useEffect(() => {
    if (!isBotSaved) {
      const data = {...botData, botArr};
      data.botName = localData.botName || "";
      console.log(data);
      dispatch(setBot(data));
    } else {
      const updatedData = {...updateData, botArr};
      console.log(updatedData);
      dispatch(setBotUpdate(updatedData));
    }
  }, [botArr, botData]);

  useEffect(() => {
    console.log(localData);
    if (!isBotSaved) {
      console.log(localData.botArr);
      setBotArr(localData.botArr || []);
      setBotData({
        botName: localData.botName || "",
        theme: localData.theme || "light",
        botArr: localData.botArr || [],
      });
    }
  }, [mainFolder]);

  let occurrenceCounter = {};
  function countWithSequence(type, category) {
    const key = `${type}-${category}`;
    !occurrenceCounter[key] ? (occurrenceCounter[key] = 1) : (occurrenceCounter[key] += 1);
    return occurrenceCounter[key];
  }

  return (
    <>
      <div className={style.mainContainer}>
        <div className={style.leftChooseContainer}>
          <div className={style.bubblesBox}>
            <h3>Questions</h3>
            <div className={style.box}>
              <div onClick={() => botClkHandler("Text", "Bubble")}>
                <MdOutlineTextsms className={style.icon1} /> Text
              </div>
              <div onClick={() => botClkHandler("Image", "Bubble")}>
                <CiImageOn className={style.icon1} /> Image
              </div>
              <div onClick={() => botClkHandler("Video", "Bubble")}>
                <FiVideo className={style.icon1} /> Video
              </div>
              <div onClick={() => botClkHandler("GIF", "Bubble")}>
                <MdGif className={style.icon1} /> GIF
              </div>
            </div>
          </div>
          <div className={style.bubblesBox} style={{paddingTop: "10px"}}>
            <h3>Inputs</h3>
            <div className={style.box}>
              <div onClick={() => botClkHandler("Text", "Input")}>
                <PiTextTBold className={style.icon2} /> Text
              </div>
              <div onClick={() => botClkHandler("Number", "Input")}>
                <MdOutlineNumbers className={style.icon2} /> Number
              </div>
              <div onClick={() => botClkHandler("Email", "Input")}>
                <MdAlternateEmail className={style.icon2} /> Email
              </div>
              <div onClick={() => botClkHandler("Phone", "Input")}>
                <IoCallOutline className={style.icon2} /> Phone
              </div>
              <div onClick={() => botClkHandler("Date", "Input")}>
                <CiCalendarDate className={style.icon2} /> Date
              </div>
              <div onClick={() => botClkHandler("Rating", "Input")}>
                <FaRegStar className={style.icon2} /> Rating
              </div>
            </div>
          </div>
        </div>
        {/* right Container */}
        <div className={style.rightContainer}>
          <div className={style.startTxt}>
            <img src={flag} alt="" /> {isBotSaved ? "You can Update" : "Start"}
          </div>

          {skeleton ? (
            <div style={{marginTop: "13px"}}>
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton width={300} height={90} borderRadius={14} style={{marginBottom: "20px"}} />
                <Skeleton width={300} height={90} borderRadius={14} style={{marginBottom: "20px"}} />
                <Skeleton width={300} height={90} borderRadius={14} style={{marginBottom: "20px"}} />
                <Skeleton width={300} height={90} borderRadius={14} />
              </SkeletonTheme>
            </div>
          ) : (
            botArr?.map((bot, i) => (
              <div style={{transform: bot.category == "Input" && "translateX(130px)"}} key={i} className={style.botBox}>
                {bot.type} {countWithSequence(bot.type, bot.category)}
                <div onClick={() => deleteBotHandler(i)} className={style.deleteBtn}>
                  <RiDeleteBin6Line />
                </div>
                {bot.category !== "Input" && (
                  <textarea
                    autoFocus
                    style={{maxHeight:`${bot.value.length}px`}}
                    value={bot.value}
                    onChange={(event) => botInputHandler(event, i)}
                    placeholder={bot.type == "Text" ? "Enter text" : "Click to add link"}
                    type="text"
                    name=""
                    id=""
                  ></textarea>
                )}
                {bot.category == "Input" && (
                  <input className={style.userTxt} type="text" autoFocus readOnly placeholder={`Note: User will input ${bot.type} ${bot.type == "Phone" ? "No. " : ""}on his form`} name="" id="" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BotPage;
