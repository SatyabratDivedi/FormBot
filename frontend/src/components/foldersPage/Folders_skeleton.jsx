import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {useNavigate} from "react-router-dom";
import icon from "./../../assets/icon.png";
import style from "./folders.module.css";

const Folders_skeleton = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{background: "#18181b", height: "100vh"}}>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div style={{display: "flex", justifyContent: "space-between", paddingInline: "10%", paddingTop: "8px", borderBottom: "1px solid rgb(61, 61, 61)", paddingBottom: "12px"}}>
            <div onClick={() => navigate("/")} className={style.formBotHeader}>
              <img src={icon} alt="" />
              <div>FormBot</div>
            </div>
            <Skeleton width={200} height={40} borderRadius={5} />
          </div>
          <div style={{padding: "30px 10%", display: "flex", gap: "17px"}}>
            <Skeleton width={200} height={40} borderRadius={5} />
            <Skeleton width={80} height={40} borderRadius={5} />
            <Skeleton width={80} height={40} borderRadius={5} />
            <Skeleton width={80} height={40} borderRadius={5} />
          </div>
          <div style={{padding: "30px 10%", display: "flex", gap: "17px"}}>
            <Skeleton width={220} height={270} borderRadius={5} />
            <Skeleton width={220} height={270} borderRadius={5} />
            <Skeleton width={220} height={270} borderRadius={5} />
          </div>
        </SkeletonTheme>
      </div>
    </>
  );
};

export default Folders_skeleton;
