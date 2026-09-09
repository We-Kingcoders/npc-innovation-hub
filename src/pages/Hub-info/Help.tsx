// src/pages/Hub-info/Help.tsx
//
// "Chat with Us" - reachable from the Footer's Support column (see
// Footer.tsx) rather than a broken, unwired button. Previously used a
// random Unsplash stock photo as a full-page background and a person's
// photo (meant for the Hero carousel) as a "Profile" avatar for the Hub
// itself - both replaced with a plain, branded navy header consistent with
// the rest of the site.
import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import axios from "axios";
import { Bot, User, Send, Loader2, MessageCircle } from "lucide-react";
import { CHATBOT_API_URL as FASTAPI_URL } from "../../config/env";

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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F9FB] flex flex-col items-center py-8">
      {/* Header - navy, matching the site's brand color everywhere else. */}
      <div className="bg-[#002B56] w-full py-10 px-6 flex flex-col items-center text-center mb-8">
        <MessageCircle
          className="w-10 h-10 text-white mb-3"
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Chat with Us
        </h2>
        <p className="text-white/70 mt-2 max-w-md">
          Ask NPC Innovation Hub&apos;s assistant a question and get an instant
          answer.
        </p>
      </div>

      {/* Chat container */}
      <div className="w-full max-w-3xl mx-4 rounded-lg shadow-sm overflow-hidden border border-gray-200 bg-white">
        <div className="p-4 min-h-[600px] w-full flex flex-col">
          <div className="w-full px-4 space-y-6 flex-grow overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 py-16">
                <Bot
                  className="w-10 h-10 text-[#002B56]/40"
                  aria-hidden="true"
                />
                <p>Send a message to start chatting!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 w-full ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#002B56] flex items-center justify-center flex-shrink-0">
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-white" aria-hidden="true" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                    )}
                  </div>
                  {message.sender === "user" ? (
                    <div className="bg-[#002B56] text-white rounded-2xl px-6 py-4 max-w-[80%] text-base">
                      {message.text}
                    </div>
                  ) : (
                    <div
                      className={`${message.isError ? "bg-red-50 border-red-300" : "bg-[#F3F9FB] border-gray-200"} text-gray-700 rounded-2xl px-6 py-4 max-w-[80%] text-base border`}
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
              <div className="flex items-end gap-2 w-full">
                <div className="w-8 h-8 rounded-full bg-[#002B56] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="bg-[#F3F9FB] text-gray-700 rounded-2xl px-6 py-4 max-w-[80%] text-base border border-gray-200">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-6 px-4 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading ? "Waiting for response..." : "Type your question..."
              }
              className="px-4 py-4 w-full border border-gray-300 rounded-full bg-white text-sm outline-none focus:border-[#00A0E3] text-gray-600"
              disabled={isLoading}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={isLoading || inputValue.trim() === ""}
              aria-label="Send message"
              className={`w-12 h-12 flex-shrink-0 ${isLoading ? "bg-gray-400" : "bg-[#002B56] hover:bg-[#003366]"} rounded-full flex items-center justify-center transition-colors`}
            >
              {isLoading ? (
                <Loader2
                  className="w-5 h-5 text-white animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send className="w-5 h-5 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDesign;
