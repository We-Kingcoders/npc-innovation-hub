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
import { Bot, User, Send, Loader2, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  sendAssistantMessage,
  type AssistantChatTurn,
} from "../../api/assistant.api";

type Message = {
  id: number;
  text: string;
  sender: string;
  isError?: boolean;
  language?: string;
};

// Shown in the empty state before the first message - a real question a
// visitor can tap instead of typing, grounded in what the assistant can
// actually answer (see the backend's knowledgeRetrieval.service.ts).
const SUGGESTED_QUESTIONS = [
  "What is NPC Innovation Hub?",
  "What projects does NPC Innovation Hub work on?",
  "What is NPC's mission and vision?",
  "How can I contact NPC Innovation Hub?",
];

// Sent with every request so the assistant can follow a conversation -
// the backend independently caps this again server-side regardless of
// what's sent here (see AI_MAX_HISTORY_MESSAGES), so this is just keeping
// the request itself reasonably sized, not the only limit in place.
const MAX_LOCAL_HISTORY_TURNS = 8;

const ChatDesign = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // The original text of the most recent failed send, so the Retry
  // button can resend exactly that rather than whatever's currently
  // typed in the input. Cleared on the next successful send.
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  // Auto-scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Assigned by the backend on the first successful reply, then reused
  // for every later turn in this session - purely a log-correlation id
  // server-side (see the plan's "no persisted conversation" decision),
  // not something this page ever reads the contents of.
  const conversationIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // useEffect runs on mount too, and messages starts as [] - without
    // this guard, the page auto-scrolled itself down to the (empty)
    // message list the instant it loaded, before the visitor ever saw
    // the "Chat with Us" heading and info card above it. Found by
    // screenshotting the page, not by reading the code - it looked like
    // a completely different, broken layout (the fixed Navbar appearing
    // mid-page in a full-page capture) until traced back to this.
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? inputValue).trim();
    if (text !== "") {
      setLastFailedText(null);

      // Add user message to chat
      const newUserMessage = {
        id: messages.length + 1,
        text,
        sender: "user",
      };

      // Capped local history sent alongside this turn, built BEFORE
      // adding the new message (it represents everything prior to it).
      // The backend independently re-validates and re-truncates this -
      // see chatOrchestrator.service.ts - so this is just keeping the
      // request itself reasonably sized, not a security boundary.
      const history: AssistantChatTurn[] = messages
        .filter((m) => !m.isError)
        .slice(-MAX_LOCAL_HISTORY_TURNS)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");

      // Show loading state
      setIsLoading(true);

      try {
        const response = await sendAssistantMessage({
          message: text,
          conversationId: conversationIdRef.current,
          history,
        });

        conversationIdRef.current = response.data.conversationId;

        const botMessage = {
          id: messages.length + 2,
          text: response.data.message,
          sender: "bot",
          language:
            response.data.language !== "auto"
              ? response.data.language
              : undefined,
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Error calling NPC AI Assistant:", err);

        // The backend already returns a specific, friendly message per
        // failure category (provider unavailable, rate-limited, network,
        // etc. - see assistant.controller.ts) - the shared apiClient's
        // response interceptor unwraps it onto err.message, so this is
        // real, distinct feedback rather than one hardcoded string for
        // every possible failure.
        const message =
          (err as { message?: string })?.message ||
          "Sorry, I couldn't process your request. Please try again.";

        const errorBotMessage = {
          id: messages.length + 2,
          text: message,
          sender: "bot",
          isError: true,
        };

        setMessages((prev) => [...prev, errorBotMessage]);
        setLastFailedText(text);
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
    <div className="min-h-screen w-full bg-[#F3F9FB] py-8 md:py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-6">
          <MessageCircle
            className="w-8 h-8 md:w-10 md:h-10 text-[#002B56] mx-auto mb-2"
            aria-hidden="true"
          />
          <h1 className="text-2xl md:text-4xl font-bold text-[#002B56]">
            Chat with Us
          </h1>
        </div>

        {/* Same left-info / right-content card layout as the Contact Us
            page (ContactSection.tsx), for consistency. The card's height
            is a viewport-relative band (not a flat min-h-[560px], which
            could run taller than the space actually left under the navbar
            on a shorter screen) so it fits neatly under the navbar on
            whatever device it's opened on instead of forcing the page to
            scroll further than it needs to. Below md it drops the fixed
            band and just flows - the two panels stack naturally instead
            of squeezing into a short viewport-relative box. */}
        <div className="flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden md:h-[min(70vh,640px)] md:min-h-[420px]">
          {/* Left - Info panel */}
          <div className="bg-[#002B56] text-white p-6 md:p-8 md:w-2/5 flex flex-col flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
              NPC Innovation Hub
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-4 md:mb-8">
              Ask our assistant a question and get an instant answer, day or
              night.
            </p>

            <div className="flex items-start gap-3 md:mt-auto">
              <Mail
                className="w-5 h-5 text-[#002B56] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Need something else?</p>
                <p className="text-white/70 text-sm mb-1">
                  See our full contact details and message form.
                </p>
                <Link
                  to="/contact-us"
                  className="text-[#002B56] font-semibold text-sm hover:underline"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Chat interface. min-h-0 lets this flex child shrink
              below its content's natural height so the message list's own
              overflow-y-auto is what scrolls, not the card or the page. */}
          <div className="bg-white p-4 md:w-3/5 flex flex-col min-h-[420px] md:min-h-0">
            <div
              className="w-full px-4 space-y-6 flex-1 min-h-0 overflow-y-auto"
              aria-live="polite"
              aria-label="Conversation with the NPC Innovation Hub assistant"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 py-16">
                  <Bot
                    className="w-10 h-10 text-[#002B56]/40"
                    aria-hidden="true"
                  />
                  <p>Send a message to start chatting!</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-sm">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        onClick={() => void sendMessage(question)}
                        className="text-xs md:text-sm bg-[#F3F9FB] border border-gray-200 text-[#002B56] rounded-full px-3 py-1.5 hover:bg-[#002B56] hover:text-white hover:border-[#002B56] transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
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
                        {message.isError &&
                          lastFailedText &&
                          !isLoading &&
                          message.id === messages[messages.length - 1]?.id && (
                            <button
                              onClick={() => void sendMessage(lastFailedText)}
                              className="text-xs font-semibold text-red-700 hover:underline mt-2"
                            >
                              Retry
                            </button>
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

            <div className="mt-4 px-4 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                aria-label="Type your question for the NPC Innovation Hub assistant"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isLoading
                    ? "Waiting for response..."
                    : "Type your question..."
                }
                className="px-4 py-4 w-full border border-gray-300 rounded-full bg-white text-sm outline-none focus:border-[#002B56] text-gray-600"
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
