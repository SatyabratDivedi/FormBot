import {useEffect, useState} from "react";
import style from "./themePage.module.css";
import theme1 from "./../../assets/theme1.png";
import theme2 from "./../../assets/theme2.png";
import theme3 from "./../../assets/theme3.png";
import whatsappDarkImg from "./../../assets/darkImg.webp";
import whatsappLightImg from "./../../assets/lightWhatsappImg.png";
import whatsappBlueImg from "./../../assets/whatsappImg.webp";
import circleImg from "./../../assets/me-square.png.png";
import {useDispatch, useSelector} from "react-redux";
import {setBot} from "../../redux/botSlice";
import {setBotUpdate} from "../../redux/botUpdateSlice";

const ThemePage = ({botDetails, isBotSaved}) => {
  const updateData = useSelector((store) => store?.botUpdateReducer?.updateData);
  console.log(updateData);
  const arrData = JSON.parse(localStorage.getItem("storeBot"));
  const [theme, setTheme] = useState(updateData.theme);
  console.log("theme: ", theme);
  const dispatch = useDispatch();

  const themeHandler = (themeName) => {
    setTheme(themeName);
    console.log(themeName);
    if (isBotSaved) {
      console.log(updateData);
        dispatch(setBotUpdate({...updateData, theme: themeName}));
    }
    if (arrData) {
      console.log(arrData);
      arrData.theme = themeName;
      localStorage.setItem("storeBot", JSON.stringify(arrData));
      dispatch(setBot(arrData));
    }
  };

  useEffect(() => {
    if (isBotSaved) {
      console.log(updateData);
      if (updateData) {
        setTheme(updateData.theme);
      }
    } else {
      setTheme(arrData.theme);
    }
  }, [isBotSaved, botDetails, arrData]);

  return (
    <>
      <div className={style.themeMainContainer}>
        <div className={style.leftContainer}>
          <div>
            <h3>Customize the theme</h3>
          </div>
          <div className={style.boxContainer}>
            <div onClick={() => themeHandler("light")} style={{border: theme == "light" ? "2px solid #1a5fff" : ""}} className={style.box}>
              <img src={theme1} alt="" />
              <div>Light</div>
            </div>
            <div onClick={() => themeHandler("dark")} style={{border: theme == "dark" ? "2px solid #1a5fff" : ""}} className={style.box}>
              <img src={theme2} alt="" />
              <div>Dark</div>
            </div>
            <div onClick={() => themeHandler("blue")} style={{border: theme == "blue" ? "2px solid #1a5fff" : ""}} className={style.box}>
              <img src={theme3} alt="" />
              <div>Tail Blue</div>
            </div>
          </div>
        </div>
        {/* right section */}
        <div className={style.chatContainer} style={{backgroundImage: (theme == "dark" && `url(${whatsappDarkImg})` ) || (theme == "light" && `url(${whatsappLightImg})`) || (theme == "blue" && `url(${whatsappBlueImg})`)}}>
          <div style={{display: "flex"}}>
            <img src={circleImg} alt="" />
            <h2 className={style.welcomeSms}>Hello</h2>
          </div>
          <div style={{width: "100%", display: "flex", justifyContent: "end"}}>
            <div className={style.chatBubble}>Hi!</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemePage;
