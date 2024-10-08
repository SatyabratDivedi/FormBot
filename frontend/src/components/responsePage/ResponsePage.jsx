import {useEffect, useState} from "react";
import style from "./responsePage.module.css";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const ResponsePage = () => {
  const param = useParams();
  const [responseData, setResponseData] = useState([]);
  const [skeleton, setSkeleton] = useState(true);

  const fetchFolderFn = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/get_bot_response/${param.botId}/`, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      console.log(result.botResponse);
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
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString("en-IN", options);
  };
  console.log(responseData);

  const giveFirstQuestion = (botArr) => {
    console.log(botArr[0].type, botArr[0].value);
    const findFirstAnswerBot = botArr.find((bot) => bot.category == "Bubble");
    return findFirstAnswerBot.value;
  };

  const giveFirstAnswer = (botArr) => {
    console.log(botArr[0].type, botArr[0].value);
    const findFirstAnswerBot = botArr.find((bot) => bot.category == "Input");
    return findFirstAnswerBot.value;
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
              <th>Submitted at</th>
              <th>First Question</th>
              <th>First Answer</th>
              <th>Response Id</th>
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
                <td style={{textAlign:'center'}} colSpan="5">No any response till now</td>
              </tr>
            ) : (
              responseData.map((data) => (
                <tr key={data._id}>
                  <td>{dateFormate(data.createdAt)}</td>
                  <td>{giveFirstQuestion(data.botResponseArr)}</td>
                  <td>{giveFirstAnswer(data.botResponseArr)}</td>
                  <td>{data._id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ResponsePage;
