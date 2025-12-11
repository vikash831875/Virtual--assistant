import React, { useState, useContext, useEffect, useRef } from "react";
import { userDataContext } from "../context/userContext";
import { RxCross1 } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { getGeminiResponse, userData } = useContext(userDataContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    const res = await getGeminiResponse(input);

    const aiMsg = { sender: "ai", text: res?.response || "No response" };
    setMessages(prev => [...prev, aiMsg]);

    setInput("");
  };

  return (
    <div className="w-full h-[100vh] flex flex-col bg-gradient-to-br from-[#050505] to-[#111]">

      {/* Header */}
      <div className="w-full h-[70px] bg-[#ffffff0f] backdrop-blur-lg 
      flex items-center justify-between px-5 shadow-lg border-b border-white/10">

        <div className="flex items-center gap-3">
          <IoArrowBack 
            onClick={() => navigate("/")}
            className="text-white bg-white/20 hover:bg-white/40 p-1 rounded-full text-3xl cursor-pointer"
          />
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Chat with {userData?.assistantName}
          </h1>
        </div>

        <RxCross1
          className="text-white w-[25px] h-[25px] cursor-pointer hover:rotate-90 transition"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 w-full overflow-auto p-5 flex flex-col gap-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-white shadow-md
              animate-fadeIn
              ${
                msg.sender === "user"
                  ? "bg-blue-600 self-end"
                  : "bg-white/10 backdrop-blur-md border border-white/10"
              }`}
          >
            {msg.text}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full h-[85px] bg-[#ffffff0f] backdrop-blur-lg 
      border-t border-white/10 px-4 flex items-center gap-3">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 text-white bg-white/10 border border-white/20 
          rounded-2xl outline-none placeholder-gray-300 focus:bg-white/20 
          transition shadow-lg"
          placeholder="Type your message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
          rounded-2xl font-semibold shadow-lg transition active:scale-95"
        >
          Send
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
