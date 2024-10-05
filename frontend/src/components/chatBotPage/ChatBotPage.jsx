import React, {useState, useEffect} from "react";
import styles from "./chatBotPage.module.css";
import {FiSend} from "react-icons/fi";

const ChatBot = () => {
  const botArray= [
    { type: 'Text', category: 'Bubble', value: 'kaise ho bahi' },
    { type: 'Text', category: 'Input', value: '' },
    {
      type: 'Text',
      category: 'Bubble',
      value: 'ek photo dikha rha hu btaoo kaisaa hai'
    },
    {
      type: 'Image',
      category: 'Bubble',
      value: 'https://th.bing.com/th/id/OIP.M71mXu7kyV4yF_3zXvKXoAHaHq?rs=1&pid=ImgDetMain'
    },
    { type: 'Text', category: 'Input', value: '' },
    { type: 'Text', category: 'Bubble', value: 'video bhi dekh lo ek' },
    {
      type: 'Video',
      category: 'Bubble',
      value: 'https://youtu.be/NiSjsjK-ZDU?si=s9b00MXYHpMsoUmY'
    },
    { type: 'Text', category: 'Bubble', value: 'kaisa lga rating do' },
    { type: 'Rating', category: 'Input', value: '' },
    { type: 'Text', category: 'Bubble', value: 'apna email do' },
    { type: 'Email', category: 'Input', value: '' },
    {
      type: 'Text',
      category: 'Bubble',
      value: 'kb mila jaye date btaoo'
    },
    { type: 'Date', category: 'Input', value: '' },
    { type: 'Text', category: 'Bubble', value: 'ok by by' },
    {
      type: 'GIF',
      category: 'Bubble',
      value: 'https://media.tenor.com/CEDASLqDzSAAAAAC/bye-bye-bye.gif'
    }
  ]

  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isUserInputVisible, setIsUserInputVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [consecutiveInputs, setConsecutiveInputs] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

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

    showNextItem();
  }, [currentIndex]);

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
    <div className={styles.chatContainer}>
      {responses.map((item, index) => (
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
          <button className={styles.finishButton} onClick={() => setShowCongrats(true)}>
            Finish
          </button>
        </div>
      )}

      {showCongrats && (
        <div className={styles.flowerAnimation}>
          <div className={styles.flowerMessage}>🎉 Congratulations! Your form has been submitted 🎉</div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
