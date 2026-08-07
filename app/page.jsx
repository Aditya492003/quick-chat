'use client';
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PrompBox from "@/components/PrompBox";
import Sidebar from "@/components/sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const { messages, isLoading, sendMessage } = useAppContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const samplePrompts = [
    { title: "Write a React Hook", text: "Create a custom React hook for fetching API data with error handling." },
    { title: "Python Algorithm", text: "Write a Python script implementing binary search tree insertion and traversal." },
    { title: "Explain Code", text: "Explain how async/await works under the hood in JavaScript." },
    { title: "Generate SQL", text: "Write a SQL query to find top 5 highest spending customers this month." }
  ];

  return (
    <div className="flex h-screen bg-[#292a2d] text-white overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar expand={expand} setExpand={setExpand} />

      <div className="flex-1 flex flex-col items-center justify-between px-4 py-6 relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden absolute px-4 top-4 left-0 right-0 flex items-center justify-between w-full z-40 bg-[#292a2d]/90 py-2 backdrop-blur">
          <Image
            onClick={() => setExpand(!expand)}
            className="rotate-180 cursor-pointer w-6 h-6"
            src={assets.menu_icon}
            alt="Menu"
          />
          <span className="font-semibold text-sm">Quick Chat</span>
          <Image className="opacity-70 w-6 h-6" src={assets.chat_icon} alt="Chat" />
        </div>

        {/* Messages / Welcome View */}
        <div className="w-full max-w-3xl flex-1 overflow-y-auto pt-10 md:pt-4 px-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center my-auto pt-12">
              <div className="flex items-center gap-3 mb-2">
                <Image src={assets.deepthink_icon} alt="Logo" className="h-14 w-14" />
                <h1 className="text-3xl font-semibold text-white tracking-tight">Hi, I'm Quick Chat.</h1>
              </div>
              <p className="text-gray-400 text-sm mb-8">Powered by Groq & DeepSeek Llama-3.3-70b. How can I help you today?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {samplePrompts.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => sendMessage(item.text)}
                    className="p-4 bg-[#34353a] hover:bg-[#3d3e44] border border-gray-700/50 rounded-2xl cursor-pointer text-left transition shadow-md group"
                  >
                    <p className="text-sm font-semibold text-white mb-1 group-hover:text-blue-400 transition">{item.title}</p>
                    <p className="text-xs text-gray-400 truncate">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 max-w-3xl text-sm py-3 text-gray-400 animate-pulse">
                  <Image src={assets.logo_icon} alt="AI" className="h-8 w-8 p-1 border border-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs ml-2 text-gray-400">Quick Chat is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Prompt Box */}
        <div className="w-full flex flex-col items-center">
          <PrompBox />
          <p className="text-[11px] mt-2 text-gray-500 text-center">
            AI-generated content for reference. Quick Chat can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
