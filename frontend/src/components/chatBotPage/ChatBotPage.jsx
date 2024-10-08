import {useState, useEffect} from "react";
import styles from "./chatBotPage.module.css";
import {FiSend} from "react-icons/fi";
import {useParams} from "react-router-dom";

const ChatBot = () => {
  const [botArray, setBotArray] = useState([]);
  const [botDetails, setBotDetail] = useState();
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isUserInputVisible, setIsUserInputVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [consecutiveInputs, setConsecutiveInputs] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [formId, setFormId] = useState();
  const param = useParams();

  const saveBotResponseFn = async () => {
    console.log(param.botId);
    try {
      const res = await fetch(`http://localhost:3000/api/bot_response_save/${param.botId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({responses}),
      });
      console.log(res);
      const result = await res.json();
      console.log(result.formId);
      if (res.ok) {
        setFormId(result.formId);
        setShowCongrats(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBotDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/bot_form_details/${param.botId}`);
      const result = await res.json();
      setBotArray(result?.botArr);
      setBotDetail(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching bot details:", error);
    }
  };
  useEffect(() => {
    fetchBotDetails();
  }, []);

  useEffect(() => {
    if (botArray.length > 0) {
      setCurrentIndex(0); // This will trigger the showNextItem function
    }
  }, [botArray]);

  useEffect(() => {
    const showNextItem = () => {
      if (currentIndex < botArray.length) {
        const currentItem = botArray[currentIndex];

        if (currentItem.category === "Bubble") {
          setIsBotTyping(true);
          setTimeout(() => {
            setResponses((prev) => [
              ...prev,
              {
                category: "Bubble",
                type: currentItem.type,
                value: currentItem.value,
              },
            ]);
            setIsBotTyping(false);
            // Move to the next item
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setConsecutiveInputs(0); // Reset consecutive inputs count
          }, 1000);
        } else if (currentItem.category === "Input") {
          setIsUserInputVisible(true);
          setConsecutiveInputs((prev) => prev + 1);
        }
      } else {
        setIsFinished(true);
      }
    };

    if (botArray.length > 0) {
      showNextItem();
    }
  }, [currentIndex, botArray]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === "") return;

    // Add user's answer to responses
    setResponses((prev) => [...prev, {category: "Input", value: userInput}]);
    setUserInput("");
    setIsUserInputVisible(false);

    // Move to the next item
    setCurrentIndex((prevIndex) => prevIndex + 1);

    // If there are more consecutive inputs, keep the input visible
    if (consecutiveInputs > 1) {
      setConsecutiveInputs((prev) => prev - 1);
      setIsUserInputVisible(true);
    } else {
      setConsecutiveInputs(0);
    }
  };

  const getInputType = (type) => {
    switch (type) {
      case "Email":
        return "email";
      case "Date":
        return "date";
      case "Number":
        return "number";
      case "Phone":
        return "tel";
      case "Rating":
        return "range";
      default:
        return "text";
    }
  };

  return (
    <div style={{background:'rgb(31, 31, 35)', minHeight:'100vh'}}>
      <div className={styles.chatContainer} style={{background: (botDetails?.theme == "dark" && "#171923") || (botDetails?.theme == "light" && "white") || (botDetails?.theme == "blue" && "#508c9b")}}>
        {botArray?.length == 0 ? (
          <div className={`${styles.chatBubble} ${styles.bot}`}>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div>
            {responses?.map((item, index) => (
              <div key={index} className={`${styles.chatBubble} ${item.category === "Bubble" ? styles.bot : styles.user}`}>
                {item.category === "Bubble" ? (
                  <div>
                    {item.type === "Image" && <img src={item.value} alt="Question" height={200} width={200} className={styles.imageQuestion} />}
                    {item.type === "Video" &&
                      (item.value.includes("youtube.com") || item.value.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${new URL(item.value).searchParams.get("v") || item.value.split("/").pop()}`}
                          height={200}
                          width={200}
                          className={styles.videoQuestion}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="YouTube video"
                        ></iframe>
                      ) : (
                        <video src={item.value} controls height={200} width={200} className={styles.videoQuestion} />
                      ))}
                    {item.type === "GIF" && <img src={item.value} alt="Question" height={200} width={200} className={styles.gifQuestion} />}
                    {item.type === "Text" && item.value}
                  </div>
                ) : (
                  <p className={styles.userAnswer}>{item.value}</p>
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className={`${styles.chatBubble} ${styles.bot}`}>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {isUserInputVisible && (
              <form onSubmit={handleSubmit} className={styles.inputForm}>
                <>
                  <input
                    autoFocus
                    type={getInputType(botArray[currentIndex].type)}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={`Enter your ${botArray[currentIndex].type.toLowerCase()}`}
                    style={{color: (botDetails?.theme == "dark" && "white") || (botDetails?.theme == "light" && "black") || (botDetails?.theme == "blue" && "white")}}
                    className={styles.inputBox}
                    min={botArray[currentIndex].type === "Rating" ? "1" : undefined}
                    max={botArray[currentIndex].type === "Rating" ? "5" : undefined}
                  />
                  <button type="submit" className={styles.sendButton}>
                    <FiSend />
                  </button>
                </>
              </form>
            )}
            {isFinished && (
              <div className={styles.finishContainer}>
                <button
                  className={styles.finishButton}
                  onClick={() => {
                    saveBotResponseFn();
                   
                  }}
                >
                  Finish
                </button>
              </div>
            )}
            {showCongrats && (
              <div className={styles.flowerAnimation}>
                <div className={styles.flowerMessage}>🎉 Submitted, Your Form Id is:- {formId} 🎉</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
