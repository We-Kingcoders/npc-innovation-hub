// src/components/chat/ReplyPreview.tsx

import React from "react";
import { X } from "lucide-react";

interface ReplyPreviewProps {
  senderName: string;
  content: string;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  senderName,
  content,
  onCancel,
}) => (
  <div className="flex items-start gap-2 px-4 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-lg mb-2">
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-blue-600 mb-0.5">{senderName}</p>
      <p className="text-xs text-gray-600 truncate">{content}</p>
    </div>
    <button
      type="button"
      onClick={onCancel}
      className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
    >
      <X size={14} />
    </button>
  </div>
);

export default ReplyPreview;
