import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { BsChatDotsFill } from "react-icons/bs";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [hem, setHem] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {}
  };

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'hi-IN';

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utter.voice = hindiVoice;

    isSpeakingRef.current = true;
    startRecognition();

    utter.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
    };

    synth.speak(utter);
  };


  const handleCommand = (data) => {
  console.log("DATA FROM GEMINI:", data);

  if (!data) return;

  const { type = "text", userInput = "", response = "" } = data;

  if (response) speak(response);

  // ✅ UNIVERSAL YOUTUBE FIX (always works)
  if (type && type.toLowerCase().includes("youtube")) {
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        userInput || ""
      )}`,
      "_blank"
    );
    return;
  }

  switch (type) {

    // GOOGLE SEARCH
    case "google_search":
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
      break;

    // FACEBOOK
    case "facebook_open":
      window.open("https://www.facebook.com/", "_blank");
      break;

    // INSTAGRAM
    case "instagram_open":
      window.open("https://www.instagram.com/", "_blank");
      break;

    // CALCULATOR
    case "calculator_open":
      window.open("https://www.google.com/search?q=calculator", "_blank");
      break;

    // WEATHER
    case "weather_show":
      window.open("https://www.google.com/search?q=weather", "_blank");
      break;

    default:
      break;
  }
};



  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    const safeStart = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (err) {}
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      setTimeout(() => safeStart(), 1000);
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted") {
        setTimeout(() => safeStart(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (transcript.toLowerCase().includes(userData?.assistantName?.toLowerCase())) {
        try {
          setUserText(transcript);
          recognition.stop();

          const data = await getGeminiResponse(transcript);

          handleCommand(data);
          setAiText(data.response);
          setUserText("");
        } catch (err) {}
      }
    };

    safeStart();

    return () => {
      recognition.stop();
    };
  }, [userData]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] 
flex justify-center items-center flex-col gap-[20px] lg:pl-[300px]'>

      {/* Mobile Menu Button */}
      <IoMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
        onClick={() => setHem(true)} />

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${hem ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHem(false)} />

        <button className='min-w-[150px] h-[60px] bg-white text-black text-[19px] rounded-full mt-[30px]'
          onClick={handleLogOut}>Log Out</button>

        <button className='min-w-[150px] h-[60px] bg-white text-black text-[19px] rounded-full'
          onClick={() => navigate("/customize")}>Customize</button>

        <div className='w-full h-[2px] bg-gray-400'></div>

        <h1 className='text-white font-semibold text-[19px]'>History</h1>

        {/* ✅ FIXED MOBILE HISTORY */}
        <div className="w-full h-[400px] overflow-y-auto flex flex-col space-y-3 pr-2">
          {userData?.history?.map((his, index) => (
            <div 
              key={index} 
              className="text-gray-200 text-[18px] bg-white/10 p-2 rounded-md"
            >
              {his}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className='hidden lg:flex flex-col fixed left-0 top-0 h-full w-[300px] bg-black p-[20px] gap-[20px]'>
        <h1 className='text-white font-semibold text-[19px] mt-[80px]'>History</h1>

        {/* ✅ FIXED DESKTOP HISTORY */}
        <div className="w-full h-[400px] overflow-y-auto flex flex-col space-y-3 pr-2">
          {userData?.history?.map((his, index) => (
            <div 
              key={index} 
              className="text-gray-200 text-[18px] bg-white/10 p-2 rounded-md"
            >
              {his}
            </div>
          ))}
        </div>
      </div>

      {/* Logout + Customize Buttons */}
      <button className='hidden lg:block min-w-[150px] h-[60px] bg-white text-black text-[19px] rounded-full absolute top-[20px] right-[20px]'
        onClick={handleLogOut}>Log Out</button>

      <button className='hidden lg:block min-w-[150px] h-[60px] bg-white text-black text-[19px] rounded-full absolute top-[100px] right-[20px]'
        onClick={() => navigate("/customize")}>Customize</button>

      {/* Main Assistant */}
      <div className='w-[300px] h-[400px] flex justify-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>

      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt='' className='w-[200px]' />}
      {aiText && <img src={aiImg} alt='' className='w-[200px]' />}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>
        {userText ? userText : aiText ? aiText : null}
      </h1>

      {/* Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className='fixed bottom-[30px] right-[30px] bg-white text-black w-[60px] h-[60px] rounded-full flex justify-center items-center text-[25px] shadow-xl hover:scale-110 transition'
      >
        <BsChatDotsFill />
      </button>

    </div>
  );
};

export default Home;
