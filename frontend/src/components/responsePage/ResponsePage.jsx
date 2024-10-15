import {useEffect, useState} from "react";
import style from "./responsePage.module.css";
import backgroundImage from "../../assets/whatsappImg.webp";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import {RxCross2} from "react-icons/rx";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import Cookies from 'js-cookie';

const ResponsePage = () => {
  const tokenId = Cookies.get('tokenId');
  const param = useParams();
  const [responseData, setResponseData] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState([]);

  const fetchFolderFn = async () => {
    try {
      const res = await fetch(`https://form-bot-backend1.vercel.app/api/get_bot_response/${param.botId}/`, {
        method: "GET",
        headers: {
          'Authorization': tokenId,
        },
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        setResponseData(result.botResponse);
        setSkeleton(false);
      }
    } catch (error) {
      toast.error(error.message, {duration: 1000});
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, []);

  const dateFormate = (createdAtDate) => {
    const date = new Date(createdAtDate);
    const options = {timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"};
    return date.toLocaleString("en-IN", options);
  };

  const giveFirstQuestion = (botArr) => {
    const findFirstAnswerBot = botArr.find((bot) => bot.category == "Bubble");
    return findFirstAnswerBot.value;
  };

  const giveFirstAnswer = (botArr) => {
    const findFirstAnswerBot = botArr.find((bot) => bot.category == "Input");
    return findFirstAnswerBot.value;
  };
  const showResponseDetails = (data) => {
    setShowDataDetails(data?.botResponseArr);
    setShowPopUp(true);
  };

  return (
    <>
      <div className={style.responseMainContainer}>
        {/* boxContainer */}
        <div className={style.boxContainer}>
          <div className={style.box}>
            <div>Total Response</div>
            <div style={{fontSize: ".9rem", color: "gray"}}>{responseData.length == 0 || responseData.length == undefined ? "No Any Response" : responseData.length}</div>
          </div>
        </div>
        {/* submissionContainer */}
        <table>
          <thead>
            <tr>
              <th>Response Id</th>
              <th>First Question</th>
              <th>First Answer</th>
              <th>Submitted at</th>
            </tr>
          </thead>
          <tbody>
            {skeleton ? (
              <tr>
                {Array.from({length: 4}).map((_, i) => (
                  <td key={i}>
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                      <div style={{width: "100%"}}>
                        <Skeleton height={30} borderRadius={5} />
                      </div>
                    </SkeletonTheme>
                  </td>
                ))}
              </tr>
            ) : responseData.length == 0 ? (
              <tr>
                <td style={{textAlign: "center"}} colSpan="5">
                  No any response till now
                </td>
              </tr>
            ) : (
              responseData.map((data) => (
                <tr key={data._id}>
                  <td onClick={() => showResponseDetails(data, event)} style={{color: "#007BFF", textDecoration: "underline", cursor: "pointer"}}>
                    {data._id}
                  </td>
                  <td>{giveFirstQuestion(data.botResponseArr)}</td>
                  <td>{giveFirstAnswer(data.botResponseArr)}</td>
                  <td>{dateFormate(data.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* responsePopUpShow */}
        {showPopUp && (
          <div style={{backgroundImage: `url(${backgroundImage})`}} className={style.responsePopUpShow}>
            <div onClick={()=> setShowPopUp(false)} style={{fontSize: "1.3rem", position: "fixed", right: "15px",zIndex:'2000', color: "red", cursor: "pointer"}}>
              <RxCross2 />
            </div>
            {showDataDetails.map((bot, i) => (
              <div
                style={{
                  transform: bot.category == "Input" ? "translate(-50px)" : "translateX(50px)",
                  background: bot.category == "Bubble" ? "#4ec464" : "#18181b",
                  color: bot.category == "Bubble" && "black",
                }}
                key={i}
                className={style.botBox}
              >
                {bot.category === "Bubble" ? (
                  <div>
                    {bot.type === "Image" && <img src={bot.value} alt="Question" height={250} width={250} />}
                    {bot.type === "Video" &&
                      (bot.value.includes("youtube.com") || bot.value.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${new URL(bot.value).searchParams.get("v") || bot.value.split("/").pop()}`}
                          height={250}
                          width={250}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="YouTube video"
                        ></iframe>
                      ) : (
                        <video src={bot.value} controls height={200} width={200} />
                      ))}
                    {bot.type === "GIF" && <img src={bot.value} alt="Question" height={200} width={200} className={style.gifQuestion} />}
                    {bot.type === "Text" && <p style={{fontSize: "15px", fontWeight: "400"}}>{bot.value}</p>}
                  </div>
                ) : (
                  <p style={{fontSize: "15px", fontWeight: "400"}}>{bot.value}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ResponsePage;
