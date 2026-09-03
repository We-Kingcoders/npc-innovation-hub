/**
 * RejectApplicationModal Component
 * Modal for rejecting a membership application, with an optional reason
 */

import React, { useState, useEffect } from "react";

interface RejectApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  isLoading?: boolean;
  applicantName: string;
}

export const RejectApplicationModal: React.FC<RejectApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  applicantName,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(reason.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white border border-mist-300 rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="border-b border-mist-300 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-800">
              Reject Application
            </h2>
            <p className="text-sm text-mist-600 mt-1">From: {applicantName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-mist-500 hover:text-navy-800 transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-all resize-none"
              placeholder="Explain why this application is being rejected…"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-mist-500">
              If filled in, this text is included in the rejection email sent to
              the applicant. Leave it blank to send a plain rejection notice.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-navy-800 bg-mist-200 border border-mist-300 rounded-lg hover:bg-mist-300 transition-all font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Rejecting…
                </>
              ) : (
                "Reject Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectApplicationModal;
