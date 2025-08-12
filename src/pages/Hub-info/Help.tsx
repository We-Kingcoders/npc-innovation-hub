import { useState, useEffect, useRef } from "react";
import axios from "axios";

// FastAPI endpoint URL hardcoded directly
const FASTAPI_URL = "http://localhost:8000";

type Message = {
  id: number;
  text: string;
  sender: string;
  isError?: boolean;
  intent?: string;
  confidence?: number;
  language?: string;
};

const ChatDesign = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  // Auto-scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim() !== "") {
      // Clear any previous errors
      setError(null);

      // Add user message to chat
      const newUserMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");

      // Show loading state
      setIsLoading(true);

      try {
        // Call FastAPI chatbot endpoint
        const response = await axios.post(`${FASTAPI_URL}/predict`, {
          message: inputValue,
          context: [],
          options: {},
        });

        // Define the expected response type
        interface BotResponse {
          text: string;
          intent?: string;
          confidence?: number;
          detected_language?: string;
        }
        const data = response.data as BotResponse;

        // Add bot response to chat
        const botMessage = {
          id: messages.length + 2,
          text: data.text,
          sender: "bot",
          intent: data.intent,
          confidence: data.confidence,
          language: data.detected_language,
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Error calling chatbot API:", err);

        // Handle errors - show error message in chat
        const errorMessage =
          "Sorry, I couldn't process your request. Please try again.";

        const errorBotMessage = {
          id: messages.length + 2,
          text: errorMessage,
          sender: "bot",
          isError: true,
        };

        setMessages((prev) => [...prev, errorBotMessage]);
        setError("Failed to get response from chatbot");
      } finally {
        setIsLoading(false);
      }
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
        <div className="w-full max-w-4xl rounded-lg shadow-sm overflow-hidden border-4 border-black-800 backdrop-blur-sm">
          <div className="p-4 min-h-[600px] w-full flex flex-col">
            <div className="w-full px-4 space-y-6 flex-grow overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Send a message to start chatting!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex flex-col w-full">
                    {message.sender === "user" ? (
                      <div className="bg-slate-700 text-white rounded-2xl px-6 py-4 w-full max-w-[90%] self-start text-base">
                        {message.text}
                      </div>
                    ) : (
                      <div
                        className={`${message.isError ? "bg-red-50" : "bg-white/90"} text-gray-700 rounded-2xl px-6 py-4 w-full max-w-[60%] self-end text-base border ${message.isError ? "border-red-300" : "border-gray-300"}`}
                      >
                        {message.text}
                        {/* Optionally show language detected for non-English messages */}
                        {message.language && message.language !== "en" && (
                          <div className="text-xs text-gray-500 mt-2">
                            Language detected: {message.language}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex flex-col w-full">
                  <div className="bg-white/90 text-gray-700 rounded-2xl px-6 py-4 w-32 self-end text-base border border-gray-300">
                    <div className="flex space-x-2">
                      <div
                        className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-grow-[2]"></div>

            <div className="mt-auto mb-8 px-4 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isLoading ? "Waiting for response..." : "Typing........"
                }
                className="px-4 py-4 w-[85%] border border-gray-300 rounded-full bg-white text-sm outline-none focus:border-blue-400 text-gray-600"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || inputValue.trim() === ""}
                className={`w-12 h-12 ${isLoading ? "bg-gray-400" : "bg-slate-700 hover:bg-slate-600"} rounded-full flex items-center justify-center transition-colors`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDesign;
