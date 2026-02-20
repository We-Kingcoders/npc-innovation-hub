// // src/components/chat/MessageInput.tsx

// import React, { useRef, useState, useEffect } from "react";
// import {
//   Send,
//   Paperclip,
//   Smile,
//   X,
//   FileText,
//   Image as ImageIcon,
// } from "lucide-react";
// import ReplyPreview from "./ReplyPreview";

// export interface ReplyTarget {
//   id: string;
//   senderName: string;
//   content: string;
// }

// export interface AttachmentFile {
//   file: File;
//   previewUrl: string | null;
//   type: "image" | "video" | "audio" | "pdf" | "document";
// }

// const EMOJIS = [
//   // Smileys & Emotion
//   "😀",
//   "😃",
//   "😄",
//   "😁",
//   "😆",
//   "🥹",
//   "😅",
//   "😂",
//   "🤣",
//   "🥲",
//   "☺️",
//   "😊",
//   "😇",
//   "🙂",
//   "🙃",
//   "😉",
//   "😌",
//   "😍",
//   "🥰",
//   "😘",
//   "😗",
//   "😙",
//   "😚",
//   "😋",
//   "🙂‍↕️",
//   "🥳",
//   "🤩",
//   "🥸",
//   "😎",
//   "🤓",
//   "🧐",
//   "🤨",
//   "🤪",
//   "😜",
//   "😝",
//   "😛",
//   "😏",
//   "😒",
//   "🙂‍↔️",
//   "😞",
//   "😔",
//   "😟",
//   "😕",
//   "🙁",
//   "☹️",
//   "😣",
//   "😖",
//   "😫",
//   "🥶",
//   "🥵",
//   "😳",
//   "🤯",
//   "🤬",
//   "😡",
//   "😠",
//   "😤",
//   "😭",
//   "😢",
//   "🥺",
//   "😩",
//   "😱",
//   "😨",
//   "😶‍🌫️",
//   "😰",
//   "😥",
//   "😓",
//   "🤗",
//   "🤔",
//   "🫣",
//   "🤭",
//   "🫡",
//   "🤫",
//   "🫠",
//   "🤥",
//   "😶",
//   "🫥",
//   "😐",
//   "🫤",
//   "😑",
//   "🫨",
//   "😬",
//   "🙄",
//   "😯",
//   "🤐",
//   "😵",
//   "😮‍💨",
//   "😪",
//   "🤤",
//   "😴",
//   "🥱",
//   "😲",
//   "😮",
//   "😧",
//   "😦",
//   "🥴",
//   "🤢",
//   "🤮",
//   "🤧",
//   "😷",
//   "🤒",
//   "🤕",
//   "🤑",
//   "🤠",
//   "😈",
//   "👿",
//   "👹",
//   "😸",
//   "😺",
//   "🎃",
//   "👾",
//   "👽",
//   "☠️",
//   "💀",
//   "👻",
//   "💩",
//   "🤡",
//   "👺",
//   "😹",
//   "😻",
//   "😼",
//   "😽",
//   "🙀",
//   "😿",
//   "😾",

//   // Gestures & Body Parts
//   "🫶",
//   "🤲",
//   "👐",
//   "🙌",
//   "👏",
//   "🤝",
//   "👍",
//   "👎",
//   "👊",
//   "✊",
//   "🤛",
//   "🤜",
//   "🫷",
//   "🫸",
//   "🤞",
//   "✌️",
//   "🫰",
//   "☝️",
//   "👇",
//   "👆",
//   "👉",
//   "👈",
//   "🫴",
//   "🫳",
//   "🤏",
//   "🤌",
//   "👌",
//   "🤘",
//   "🤟",
//   "✋",
//   "🤚",
//   "🖐️",
//   "🖖",
//   "👋",
//   "🤙",
//   "🫲",
//   "🫱",
//   "💪",
//   "🦾",
//   "🖕",
//   "✍️",
//   "👂",
//   "👅",
//   "🦷",
//   "🫦",
//   "👄",
//   "💋",
//   "💄",
//   "🦿",
//   "🦵",
//   "🦶",
//   "🫵",
//   "🙏",
//   "🦻",
//   "👃",
//   "👣",
//   "👁️",
//   "👀",
//   "🫀",
//   "🫁",
//   "🧠",
//   "🗣️",
//   "👤",
//   "👥",
//   "🫂",

//   // People
//   "🧑‍🦰",
//   "👩‍🦰",
//   "👨‍🦱",
//   "🧑‍🦱",
//   "👩‍🦱",
//   "👨",
//   "🧑",
//   "👩",
//   "👦",
//   "🧒",
//   "👧",
//   "👶",
//   "👨‍🦰",
//   "👱‍♀️",
//   "👱",
//   "👱‍♂️",
//   "👩‍🦳",
//   "🧑‍🦳",
//   "👨‍🦳",
//   "👩‍🦲",
//   "🧑‍🦲",
//   "👨‍🦲",
//   "🧔‍♀️",
//   "🧔",
//   "👮‍♂️",
//   "👮",
//   "👮‍♀️",
//   "🧕",
//   "👳‍♂️",
//   "👳",
//   "👳‍♀️",
//   "👲",
//   "👴",
//   "🧓",
//   "👵",
//   "🧔‍♂️",
//   "👷‍♀️",
//   "👷",
//   "👷‍♂️",
//   "💂‍♀️",
//   "💂",
//   "💂‍♂️",
//   "🕵️‍♀️",
//   "🕵️",
//   "🕵️‍♂️",
//   "👩‍⚕️",
//   "🧑‍⚕️",
//   "👨‍⚕️",
//   "👨‍🎤",
//   "🧑‍🎤",
//   "👩‍🎤",
//   "👨‍🎓",
//   "🧑‍🎓",
//   "👩‍🎓",
//   "👨‍🍳",
//   "🧑‍🍳",
//   "👩‍🍳",
//   "👨‍🌾",
//   "🧑‍🌾",
//   "👩‍🌾",
//   "👩‍🏫",
//   "🧑‍🏫",
//   "👨‍🏫",
//   "👩‍🏭",
//   "🧑‍🏭",
//   "👨‍🏭",
//   "👩‍💻",
//   "🧑‍💻",
//   "👨‍💻",
//   "👩‍💼",
//   "🧑‍💼",
//   "👨‍💼",
//   "👨‍🚒",
//   "🧑‍🚒",
//   "👩‍🚒",
//   "👨‍🎨",
//   "🧑‍🎨",
//   "👩‍🎨",
//   "👨‍🔬",
//   "🧑‍🔬",
//   "👩‍🔬",
//   "👨‍🔧",
//   "🧑‍🔧",
//   "👩‍🔧",
//   "👩‍✈️",
//   "🧑‍✈️",
//   "👨‍✈️",
//   "👩‍🚀",
//   "🧑‍🚀",
//   "🧑‍⚖️",
//   "👨‍⚖️",
//   "👰‍♀️",
//   "👰",
//   "👰‍♂️",
//   "🦹",
//   "🦹‍♀️",
//   "🦸‍♂️",
//   "🦸",
//   "🥷",
//   "🤴",
//   "🫅",
//   "👸",
//   "🤵‍♂️",
//   "🤵",
//   "🤵‍♀️",
//   "🦹‍♂️",
//   "🧑‍🎄",
//   "🎅",
//   "🧙‍♀️",
//   "🧙",
//   "🧙‍♂️",
//   "🧝‍♀️",
//   "🧝",
//   "🧝‍♂️",
//   "🧌",
//   "🧛‍♀️",
//   "🧚‍♀️",
//   "🧜‍♂️",
//   "🧜",
//   "🧜‍♀️",
//   "🧞‍♂️",
//   "🧞",
//   "🧞‍♀️",
//   "🧟‍♂️",
//   "🧟",
//   "🧟‍♀️",
//   "🧛‍♂️",
//   "🧛",
//   "🧚",
//   "👼",
//   "🤰",
//   "🫄",
//   "🫃",
//   "🤱",
//   "👩‍🍼",
//   "🧑‍🍼",
//   "👨‍🍼",
//   "🙇‍♀️",
//   "🙇",
//   "🙋",
//   "🙋‍♀️",
//   "🙆‍♂️",
//   "🙆",
//   "🙆‍♀️",
//   "🙅‍♂️",
//   "🙅",
//   "🙅‍♀️",
//   "💁‍♂️",
//   "💁",
//   "💁‍♀️",
//   "🙇‍♂️",
//   "🙋‍♂️",
//   "🧏‍♀️",
//   "🧏",
//   "🧏‍♂️",
//   "🤦‍♀️",
//   "🤦",
//   "🤦‍♂️",
//   "🤷‍♀️",
//   "🤷",
//   "🤷‍♂️",
//   "🙎‍♀️",
//   "🙎",
//   "🧖",
//   "🧖‍♀️",
//   "💆‍♂️",
//   "💆",
//   "💆‍♀️",
//   "💇‍♂️",
//   "💇",
//   "🙍‍♂️",
//   "🧖‍♂️",
//   "💅",
//   "🤳",
//   "💃",
//   "🕺",
//   "👯‍♀️",
//   "👯",
//   "👯‍♂️",
//   "🕴️",
//   "👩‍🦽",
//   "🧑‍🦽",
//   "👨‍🦽",

//   // Symbols & Extras
//   "❤️",
//   "🔥",
//   "🎉",
//   "💯",
//   "🚀",
//   "✅",
//   "💡",
// ];

// const getFileType = (file: File): AttachmentFile["type"] => {
//   if (file.type.startsWith("image/")) return "image";
//   if (file.type.startsWith("video/")) return "video";
//   if (file.type.startsWith("audio/")) return "audio";
//   if (file.type === "application/pdf") return "pdf";
//   return "document";
// };

// interface MessageInputProps {
//   placeholder?: string;
//   isSending?: boolean;
//   replyTarget: ReplyTarget | null;
//   onCancelReply: () => void;
//   onSend: (
//     content: string,
//     attachments: AttachmentFile[],
//     replyToId: string | null,
//   ) => Promise<void>;
//   currentUserImage: string | null;
//   currentUserName: string;
// }

// const MessageInput: React.FC<MessageInputProps> = ({
//   placeholder = "Type a message...",
//   isSending = false,
//   replyTarget,
//   onCancelReply,
//   onSend,
//   currentUserImage,
//   currentUserName,
// }) => {
//   const [text, setText] = useState("");
//   const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const emojiRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Close emoji picker on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
//         setShowEmoji(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleSend = async () => {
//     if ((!text.trim() && attachments.length === 0) || isSending) return;
//     await onSend(text.trim(), attachments, replyTarget?.id ?? null);
//     setText("");
//     setAttachments([]);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleFiles = (files: FileList | null) => {
//     if (!files) return;
//     const newAttachments: AttachmentFile[] = Array.from(files).map((file) => {
//       const type = getFileType(file);
//       const previewUrl = type === "image" ? URL.createObjectURL(file) : null;
//       return { file, previewUrl, type };
//     });
//     setAttachments((prev) => [...prev, ...newAttachments]);
//   };

//   const removeAttachment = (index: number) => {
//     setAttachments((prev) => {
//       const updated = [...prev];
//       const url = updated[index].previewUrl;
//       if (url) URL.revokeObjectURL(url);
//       updated.splice(index, 1);
//       return updated;
//     });
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };
//   const handleDragLeave = () => setIsDragging(false);
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   const initials =
//     currentUserName
//       .split(" ")
//       .filter(Boolean)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2) || "Me";

//   return (
//     <div
//       className={`border-t border-gray-100 transition-colors ${isDragging ? "bg-blue-50" : "bg-white"}`}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//     >
//       {/* Reply preview — uses ReplyPreview component (not TypingIndicator) */}
//       {replyTarget && (
//         <div className="pt-2 px-4">
//           <ReplyPreview
//             senderName={replyTarget.senderName}
//             content={replyTarget.content}
//             onCancel={onCancelReply}
//           />
//         </div>
//       )}

//       {/* Attachment previews */}
//       {attachments.length > 0 && (
//         <div className="flex gap-2 px-4 pt-3 flex-wrap">
//           {attachments.map((att, i) => (
//             <div key={i} className="relative group">
//               {att.previewUrl ? (
//                 <img
//                   src={att.previewUrl}
//                   alt="attachment"
//                   className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1">
//                   {att.type === "pdf" ? (
//                     <FileText size={18} className="text-red-500" />
//                   ) : (
//                     <ImageIcon size={18} className="text-gray-400" />
//                   )}
//                   <span className="text-xs text-gray-500 truncate w-14 text-center px-1">
//                     {att.file.name}
//                   </span>
//                 </div>
//               )}
//               <button
//                 type="button"
//                 onClick={() => removeAttachment(i)}
//                 className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X size={10} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Drag-drop hint */}
//       {isDragging && (
//         <div className="flex items-center justify-center py-3 text-sm text-blue-500 font-medium">
//           Drop files to attach
//         </div>
//       )}

//       {/* Input row */}
//       <div className="flex items-center gap-3 px-4 py-3">
//         {/* Current user avatar */}
//         <div className="flex-shrink-0">
//           {currentUserImage ? (
//             <img
//               src={currentUserImage}
//               alt={currentUserName}
//               className="w-9 h-9 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] flex items-center justify-center text-white text-xs font-semibold">
//               {initials}
//             </div>
//           )}
//         </div>

//         {/* Text input + icons */}
//         <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-colors">
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder={placeholder}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="flex-1 outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
//           />

//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             className="text-gray-400 hover:text-blue-500 transition-colors p-1 flex-shrink-0"
//             title="Attach file"
//           >
//             <Paperclip size={16} />
//           </button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             multiple
//             className="hidden"
//             onChange={(e) => handleFiles(e.target.files)}
//             accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//           />

//           <button
//             type="button"
//             onClick={() => setShowEmoji((p) => !p)}
//             className="text-gray-400 hover:text-yellow-500 transition-colors p-1 flex-shrink-0"
//             title="Emoji"
//           >
//             <Smile size={16} />
//           </button>
//         </div>

//         {/* Send button */}
//         <button
//           type="button"
//           onClick={handleSend}
//           disabled={(!text.trim() && attachments.length === 0) || isSending}
//           className="p-3 bg-[#0C2340] text-white rounded-xl hover:bg-[#1a3a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
//           title="Send (Enter)"
//         >
//           <Send size={16} />
//         </button>
//       </div>

//       {/* Emoji picker */}
//       {showEmoji && (
//         <div
//           ref={emojiRef}
//           className="absolute bottom-20 right-6 bg-white rounded-xl shadow-xl border border-gray-200 p-3 grid grid-cols-8 gap-1 z-30"
//         >
//           {EMOJIS.map((emoji) => (
//             <button
//               key={emoji}
//               type="button"
//               onClick={() => {
//                 setText((p) => p + emoji);
//                 setShowEmoji(false);
//                 inputRef.current?.focus();
//               }}
//               className="p-1.5 hover:bg-gray-100 rounded-lg text-base transition-colors"
//             >
//               {emoji}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageInput;

// src/components/chat/MessageInput.tsx

import React, { useRef, useState, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import ReplyPreview from "./ReplyPreview";

export interface ReplyTarget {
  id: string;
  senderName: string;
  content: string;
}

export interface AttachmentFile {
  file: File;
  previewUrl: string | null;
  type: "image" | "video" | "audio" | "pdf" | "document";
}

// ── Emoji data (categorised for the compact picker) ──────────────────────────
const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤓",
      "😎",
      "🥸",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🫣",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥴",
      "😴",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👊",
      "✊",
      "🤛",
      "🤜",
      "👋",
      "🤚",
      "✋",
      "🖐️",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "👆",
      "👇",
      "👉",
      "👈",
      "☝️",
      "👏",
      "🙌",
      "🤲",
      "👐",
      "🙏",
      "🫶",
      "💪",
      "🦾",
    ],
  },
  {
    label: "People",
    emojis: [
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👱",
      "👨",
      "🧔",
      "👩",
      "🧓",
      "👴",
      "👵",
      "🧕",
      "👮",
      "💂",
      "🕵️",
      "👷",
      "🫅",
      "🤴",
      "👸",
      "🧙",
      "🧝",
      "🧛",
      "🧟",
      "🧞",
      "🧜",
      "🧚",
      "👼",
      "🤰",
      "🫄",
    ],
  },
  {
    label: "Animals",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🪱",
      "🐛",
      "🦋",
    ],
  },
  {
    label: "Food",
    emojis: [
      "🍎",
      "🍊",
      "🍋",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🫒",
      "🥑",
      "🍆",
      "🥦",
      "🥬",
      "🥒",
      "🌽",
      "🫑",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🧆",
      "🥚",
      "🍳",
      "🥘",
      "🍕",
      "🌮",
      "🌯",
      "🥙",
      "🧆",
      "🍔",
      "🍟",
      "🌭",
      "🍿",
      "🧂",
      "🥓",
      "🥞",
      "🧇",
      "🍱",
      "🍣",
    ],
  },
  {
    label: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🏓",
      "🏸",
      "🥊",
      "🥋",
      "🎯",
      "🏹",
      "🎣",
      "🤿",
      "🎽",
      "🎿",
      "🛷",
      "🎮",
      "🕹️",
      "🎲",
      "🧩",
      "🎭",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
    ],
  },
  {
    label: "Travel",
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🏍️",
      "✈️",
      "🚀",
      "🛸",
      "🚁",
      "🛶",
      "⛵",
      "🚢",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚄",
      "🚅",
      "🏙️",
    ],
  },
  {
    label: "Symbols",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❤️‍🔥",
      "💯",
      "✅",
      "❌",
      "⭐",
      "🌟",
      "💥",
      "🔥",
      "🎉",
      "🎊",
      "🏆",
      "🥇",
      "🎁",
      "💡",
      "🔔",
      "💬",
      "👁️",
      "🔑",
      "🛡️",
      "⚡",
    ],
  },
];

const getFileType = (file: File): AttachmentFile["type"] => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf") return "pdf";
  return "document";
};

interface MessageInputProps {
  placeholder?: string;
  isSending?: boolean;
  replyTarget: ReplyTarget | null;
  onCancelReply: () => void;
  onSend: (
    content: string,
    attachments: AttachmentFile[],
    replyToId: string | null,
  ) => Promise<void>;
  currentUserImage: string | null;
  currentUserName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = "Type a message...",
  isSending = false,
  replyTarget,
  onCancelReply,
  onSend,
  currentUserImage,
  currentUserName,
}) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close emoji picker on outside click (but NOT when clicking the emoji button itself)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(e.target as Node)
      ) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const handleSend = async () => {
    if ((!text.trim() && attachments.length === 0) || isSending) return;
    await onSend(text.trim(), attachments, replyTarget?.id ?? null);
    setText("");
    setAttachments([]);
    setShowEmoji(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Append emoji WITHOUT closing picker — user closes manually or clicks outside
  const appendEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
    // intentionally do NOT close the picker here
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: AttachmentFile[] = Array.from(files).map((file) => {
      const type = getFileType(file);
      const previewUrl = type === "image" ? URL.createObjectURL(file) : null;
      return { file, previewUrl, type };
    });
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const updated = [...prev];
      const url = updated[index].previewUrl;
      if (url) URL.revokeObjectURL(url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const initials =
    currentUserName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Me";

  return (
    <div
      className={`border-t border-gray-100 transition-colors ${isDragging ? "bg-blue-50" : "bg-white"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {/* Reply preview */}
      {replyTarget && (
        <div className="pt-2 px-4">
          <ReplyPreview
            senderName={replyTarget.senderName}
            content={replyTarget.content}
            onCancel={onCancelReply}
          />
        </div>
      )}

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 flex-wrap">
          {attachments.map((att, i) => (
            <div key={i} className="relative group">
              {att.previewUrl ? (
                <img
                  src={att.previewUrl}
                  alt="attachment"
                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1">
                  {att.type === "pdf" ? (
                    <FileText size={16} className="text-red-500" />
                  ) : (
                    <ImageIcon size={16} className="text-gray-400" />
                  )}
                  <span className="text-[10px] text-gray-500 truncate w-12 text-center px-1">
                    {att.file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isDragging && (
        <div className="flex items-center justify-center py-3 text-sm text-blue-500 font-medium">
          Drop files to attach
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {currentUserImage ? (
            <img
              src={currentUserImage}
              alt={currentUserName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
          )}
        </div>

        {/* Text + icons */}
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-colors min-w-0">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400 min-w-0"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-500 transition-colors p-0.5 flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={15} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />

          {/* Emoji toggle button */}
          <button
            ref={emojiBtnRef}
            type="button"
            onClick={() => setShowEmoji((p) => !p)}
            className={`p-0.5 flex-shrink-0 transition-colors ${showEmoji ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
            title="Emoji"
          >
            <Smile size={15} />
          </button>
        </div>

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!text.trim() && attachments.length === 0) || isSending}
          className="p-2.5 bg-[#0C2340] text-white rounded-xl hover:bg-[#1a3a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Send (Enter)"
        >
          <Send size={15} />
        </button>
      </div>

      {/* ── Compact Emoji Picker ──────────────────────────────────────────── */}
      {showEmoji && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 right-4 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ width: 280 }}
        >
          {/* Category tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-1 pt-1 gap-0.5 scrollbar-hide">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(i)}
                className={`flex-shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeCategory === i
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Emoji grid — scrollable, fixed height */}
          <div className="overflow-y-auto p-2" style={{ height: 180 }}>
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => appendEmoji(emoji)}
                  className="flex items-center justify-center w-8 h-8 text-lg rounded-lg hover:bg-gray-100 transition-colors leading-none"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {text ? `"${text.slice(-10)}"` : "Click emoji to add"}
            </span>
            <button
              type="button"
              onClick={() => setShowEmoji(false)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
