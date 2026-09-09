// src/pages/Hub-info/Help.tsx
//
// "Chat with Us" - reachable from the Footer's Support column (see
// Footer.tsx) rather than a broken, unwired button. Previously used a
// random Unsplash stock photo as a full-page background and a person's
// photo (meant for the Hero carousel) as a "Profile" avatar for the Hub
// itself - both long gone. Now uses the same left-info / right-content
// card layout as the Contact Us page (ContactSection.tsx) for visual
// consistency between the two.
import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import axios from "axios";
import { Bot, User, Send, Loader2, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen w-full bg-[#F3F9FB] py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <MessageCircle
            className="w-10 h-10 text-[#00A0E3] mx-auto mb-3"
            aria-hidden="true"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-[#002B56]">
            Chat with Us
          </h1>
        </div>

        {/* Same left-info / right-content card layout as the Contact Us
            page (ContactSection.tsx), for consistency. */}
        <div className="flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
          {/* Left - Info panel */}
          <div className="bg-[#002B56] text-white p-8 md:w-2/5 flex flex-col">
            <h2 className="text-2xl font-bold mb-3">NPC Innovation Hub</h2>
            <p className="text-white/70 mb-8">
              Ask our assistant a question and get an instant answer, day or
              night.
            </p>

            <div className="flex items-start gap-3 mt-auto">
              <Mail
                className="w-5 h-5 text-[#00A0E3] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Need something else?</p>
                <p className="text-white/70 text-sm mb-1">
                  See our full contact details and message form.
                </p>
                <Link
                  to="/contact-us"
                  className="text-[#00A0E3] font-semibold text-sm hover:underline"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Chat interface */}
          <div className="bg-white p-4 md:w-3/5 flex flex-col min-h-[560px]">
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
                        <User
                          className="w-4 h-4 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bot
                          className="w-4 h-4 text-white"
                          aria-hidden="true"
                        />
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
                  isLoading
                    ? "Waiting for response..."
                    : "Type your question..."
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
    </div>
  );
};

export default ChatDesign;
