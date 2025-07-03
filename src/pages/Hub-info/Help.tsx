import { useState } from "react";

const ChatDesign = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "How about system maintenance?", sender: "user" },
    { id: 2, text: "yes, we offer system maintenance", sender: "bot" },
    { id: 3, text: "Do you develop mobile apps?", sender: "user" },
    { id: 4, text: "yes, we do", sender: "bot" },
    { id: 5, text: "Thanks", sender: "user" },
  ]);

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newUserMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");

      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "Thank you for your message!",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center py-8">
        {/* Yellow header bar */}
        <div className="bg-yellow-400/80 h-20 w-full flex items-center px-6 mb-8"></div>

        {/* Profile section with transparent background */}
        <div className="max-w-4xl mx-auto p-6 bg-white/0 rounded-3xl flex items-center space-x-8 mb-8 backdrop-blur-sm">
          <img
            className="w-32 h-32 rounded-full border-4 border-black-500 shadow-md flex-shrink-0"
            src="/assets/images/hero.png"
            alt="Profile"
          />
          <h2 className="text-4xl font-bold text-gray-800">NPCInnovationHub</h2>
        </div>

        {/* Chat container */}
        <div className="w-full max-w-4xl  rounded-lg shadow-sm overflow-hidden border-4 border-black-800 backdrop-blur-sm">
          <div className="p-4 min-h-[600px] w-full flex flex-col">
            <div className="w-full px-4 space-y-6 flex-grow">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col w-full">
                  {message.sender === "user" ? (
                    <div className="bg-slate-700 text-white rounded-2xl px-6 py-4 w-full max-w-[90%] self-start text-base">
                      {message.text}
                    </div>
                  ) : (
                    <div className="bg-white/90 text-gray-700 rounded-2xl px-6 py-4 w-full max-w-[60%] self-end text-base border border-gray-300">
                      {message.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex-grow-[2]"></div>

            <div className="mt-auto mb-8 px-4 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Typing........"
                className="px-4 py-4 w-[85%] border border-gray-300 rounded-full bg-white text-sm outline-none focus:border-blue-400 text-gray-600"
              />
              <button
                onClick={sendMessage}
                className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="transform rotate-45 translate-x-0.5"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDesign;
