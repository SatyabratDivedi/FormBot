import style from "./mainDashboard.module.css";
import icon from "./../../assets/icon.png";
import rotateImg1 from "./../../assets/rotateImg1.png";
import rotateImg2 from "./../../assets/rotateImg2.png";
import heroImg from "./../../assets/heroImg.png";
import wrong from "./../../assets/wrong.png";
import right from "./../../assets/right.png";
import tryItOut from "./../../assets/tryItOut.png";
import welcomeGif from "./../../assets/welcomeGif.gif";
import circleImg from "./../../assets/me-square.png.png";
import easyImg2 from "./../../assets/easyImg2.png";
import companiesImg from "./../../assets/companiesImg.png";
import embedImg2 from "./../../assets/embedImg2.png";
import {featureDetails} from "./featureDetails.js";
import {teamImg} from "./featureDetails.js";
import {FaExternalLinkAlt} from "react-icons/fa";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";

const MainDashboard = () => {
  const [isLogin, setIsLogin] = useState();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const fetchFolderFn = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/isLoginCheck", {
        method: "GET",
        credentials: "include",
      });
      console.log(res.ok);
      setIsLogin(res.ok);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, [isLogin]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setTimeout(() => {
      setIsFormSubmitted(false);
    }, 2000);
  };

  const logoutHandler = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.msg, {duration: "100"});
        setIsLogin(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={style.main}>
        {/* header nav */}
        <header className={style.header}>
          <div className={style.left}>
            <img src={icon} alt="" />
            <div>FormBot</div>
          </div>
          <div className={style.right}>
            {!isLogin ? (
              <Link to={"/login"} className={`${style.signInBtn} `}>
                Sign in
              </Link>
            ) : (
              <div onClick={logoutHandler} className={`${style.logoutBtn} `}>
                Logout
              </div>
            )}
            <Link to={"/folder/main"} className={style.createFormBtn}>
              Create a FormBot
            </Link>
          </div>
        </header>
        {/* Hero Section */}
        <div className={style.hero}>
          <img src={rotateImg1} alt="" />
          <div className={style.heroTextArea}>
            <h1 className={style.h1Text}>Replace you google form with advanced chatbots</h1>
            <p className={style.pText}>Typebot gives you powerful blocks to create unique chat experiences. Embed them anywhere on your web/mobile apps and start collecting results like magic.</p>
            <Link to={"/folder/main"} className={style.getStartedBtn}>
              Create a FormBot for free
            </Link>
          </div>
          <img src={rotateImg2} alt="" />
        </div>
        {/* Main Hero Image Section */}
        <div className={style.heroImgArea}>
          <div className={style.circleFirst}></div>
          <img src={heroImg} alt="" />
          <div className={style.circleSecond}></div>
        </div>
        {/* Form Section */}
        <div className={style.formArea}>
          <div className={style.replaceTxt}>
            Replace your old school forms <br /> with <br /> chatbots
          </div>
          <p className={style.pText}>
            Typebot is a better way to ask for information. It leads to an increase in customer satisfaction and retention and multiply by <br /> 3 <br /> your conversion rate compared to classical
            forms.
          </p>
          <div className={style.wrongRightImg}>
            <img className={style.wrImg} src={wrong} alt="" />
            <img className={style.wrImg} src={right} alt="" />
            <img className={style.tryItOut} src={tryItOut} alt="" />
          </div>
          <div className={style.container}>
            <div className={style.formContainer}>
              <div style={{width: "100%", height: "100%", display: isFormSubmitted ? "flex": 'none', justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <div>🎉 Your Form has been submitted</div>
                <div>But We will not connect you shortly, sorry 😜</div>
              </div>
              <form style={{display: isFormSubmitted && "none"}} onSubmit={formSubmitHandler}>
                <label htmlFor="name">
                  Full name <span style={{color: "#FC8181"}}>*</span>
                </label>
                <input className={style.inp} type="text" id="name" name="name" placeholder="full name" required />
                <label htmlFor="email">
                  Email <span style={{color: "#FC8181"}}>*</span>
                </label>
                <input className={style.inp} type="email" id="email" name="email" placeholder="Email" required />
                <label>
                  What services are you interested in?
                </label>
                <div>
                  <input type="checkbox" id="website-dev" name="services" value="Website Dev"/> Website Dev
                  <br />
                  <input type="checkbox" id="content-marketing" name="services" value="Content Marketing" /> Content Marketing
                  <br />
                  <input type="checkbox" id="social-media" name="services" value="Social Media" /> Social Media
                  <br />
                  <input type="checkbox" id="ux-ui-design" name="services" value="UX/UI Design" /> UX/UI Design
                  <br />
                </div>
                <label htmlFor="additional-info">
                  Additional Information
                </label>
                <textarea style={{height: "80px"}} id="additional-info" placeholder="Additional Information" name="additional-info"></textarea>
                <button type="submit">Submit</button>
              </form>
            </div>
            <div className={style.chatContainer}>
              <div style={{height: "100%", marginRight: "10px", display: "flex", alignItems: "center", marginTop: "16%"}}>
                <img src={circleImg} alt="" />
              </div>
              <div>
                <h2 className={style.welcomeSms}>
                  Welcome to <b>AA</b> (Awesome Agency)
                </h2>
                <div className={style.welcomeGif}>
                  <img src={welcomeGif} alt="Welcome" />
                </div>
                <div className={style.chatBubble}>Hi!</div>
              </div>
            </div>
          </div>
        </div>
        {/* image and text feature section */}
        {/* first section */}
        <div className={style.featureContainer}>
          <div>
            <img src={easyImg2} width={"600px"} alt="" />
          </div>
          <div className={style.featureText}>
            <h3>Easy building experience</h3>
            <p>All you have to do is drag and drop blocks to create your app. Even if you have custom needs, you can always add custom code.</p>
          </div>
        </div>
        {/* second section */}
        <div style={{flexDirection: "row-reverse", paddingBlock: "0"}} className={style.featureContainer}>
          <div>
            <img src={embedImg2} width={"600px"} alt="" />
          </div>
          <div style={{paddingLeft: "0"}} className={style.featureText}>
            <h3 style={{marginTop: "70px"}}>Embed it in a click</h3>
            <p>Embedding your typebot in your applications is a walk in the park. Typebot gives you several step-by-step platform- specific instructions. Your typebot will always feel "native".</p>
          </div>
        </div>
        {/* companies section */}
        <div className={style.companiesContainer}>
          <img src={companiesImg} alt="Integrations" className={style.companiesImage} />
          <div className={style.companiesText}>
            <h2>Integrate with any platform</h2>
            <p>Typebot offers several native integrations blocks as well as instructions on how to embed Typebot on particular platforms.</p>
          </div>
        </div>
        {/* real time text section */}
        <div className={style.realTimeSection}>
          <h2>Collect results in real-time</h2>
          <p>
            One of the main advantage of a chat application is that you collect the user's responses on each question.
            <br />
            <b>You won't lose any valuable data.</b>
          </p>
        </div>
        <div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "60px"}}>
          <div style={{width: "30%", height: "410px", justifyContent: "center"}} className={style.chatContainer}>
            <div style={{marginRight: "10px", marginTop: "126px"}}>
              <img src={circleImg} alt="" />
            </div>
            <div>
              <h2 className={style.welcomeSms}>As you answer this chat, you'll see your result in the real Airtable spreadsheet</h2>
              <h2 className={style.welcomeSms}>You can think of it as a guestbook 😂</h2>
              <h2 className={style.welcomeSms}>Ready?</h2>
              <div className={style.chatBubble} style={{width: "60px"}}>
                Yeah!
              </div>
            </div>
          </div>
        </div>

        {/* feature section */}
        <div style={{marginTop: "100px"}} className={style.realTimeSection}>
          <h1>And many more features</h1>
          <p style={{color: "#718096"}}>Typebot makes form building easy and comes with powerful features</p>
        </div>
        <div className={style.boxContainer}>
          {featureDetails.map((feature, index) => (
            <div key={index} className={style.featureBox}>
              <img src={feature.image} alt="" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        {/* loved by team section */}
        <div className={style.teamContainer}>
          <h4>Loved by teams and creators from all around the world</h4>
          <div className={style.teamImg}>
            {teamImg.map((image, index) => (
              <img key={index} src={image} alt="" />
            ))}
          </div>
        </div>
        {/* user Engagement section */}
        <div className={style.engagementSection}>
          <img src={rotateImg1} alt="" />
          <h3>
            Improve conversion and user engagement <br /> with FormBots
          </h3>
          <Link to={"/folder/main"} className={style.getStartedBtn}>
            Create a From
          </Link>
          <div className={style.freePlanTxt}>No trial. Generous free plan.</div>
          <img src={rotateImg2} alt="" />
        </div>

        {/* footer section */}

        <footer className={style.footer}>
          <div className={style.footerLeft}>
            <p>
              Made with
              <span role="img" aria-label="love">
                ❤️
              </span>
              by <br /> @Satyabrat Divedi
            </p>
          </div>
          <div className={style.footerCenter}>
            <a href="#status" target="_blank" rel="noopener noreferrer">
              Status <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#documentation" target="_blank" rel="noopener noreferrer">
              Documentation <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#roadmap" target="_blank" rel="noopener noreferrer">
              Roadmap <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#pricing" target="_blank" rel="noopener noreferrer">
              Pricing
            </a>
          </div>
          <div className={style.footerCenter}>
            <a href="#discord" target="_blank" rel="noopener noreferrer">
              Discord <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#github" target="_blank" rel="noopener noreferrer">
              GitHub repository <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#twitter" target="_blank" rel="noopener noreferrer">
              Twitter <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn <FaExternalLinkAlt style={{height: "10px"}} />{" "}
            </a>
            <a href="#oss-friends" target="_blank" rel="noopener noreferrer">
              OSS Friends
            </a>
          </div>
          <div className={style.footerRight}>
            <a href="#about" target="_blank" rel="noopener noreferrer">
              About
            </a>
            <a href="#contact" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
            <a href="#terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a href="#privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainDashboard;
