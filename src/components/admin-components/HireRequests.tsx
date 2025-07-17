import { useState, useEffect } from "react";
import type {
  HireInquiry,
  HireInquiriesResponse,
} from "../../data/admin-data/HireRequest";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

export default function HireRequests() {
  const [page, setPage] = useState(1);
  const [inquiries, setInquiries] = useState<HireInquiry[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null,
  );
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const authToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://npc-innovation-hub-bn.onrender.com/api/admin/hire-inquiries",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inquiries");
        }

        const data: HireInquiriesResponse = await response.json();
        setInquiries(data.data.inquiries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [authToken]);

  const totalPages = Math.ceil(inquiries.length / PAGE_SIZE);
  const pageRequests = inquiries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleReply = async () => {
    if (!selectedInquiryId) return;
    try {
      const response = await fetch(
        `https://npc-innovation-hub-bn.onrender.com/api/admin/hire-inquiries/${selectedInquiryId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: replySubject,
            message: replyMessage,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to send reply");
      setShowReplyModal(false);
      setReplySubject("");
      setReplyMessage("");
    } catch (error) {
      console.error("Reply failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedInquiryId) return;
    try {
      // Replace this with real delete API call
      console.log("Deleting inquiry:", selectedInquiryId);
      setInquiries((prev) => prev.filter((i) => i.id !== selectedInquiryId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="mt-6">
      {pageRequests.map((inquiry) => (
        <div
          key={inquiry.id}
          className="relative bg-white rounded-xl shadow p-6 mb-6 border flex items-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-6">
            <span className="text-blue-600 text-xl font-semibold">
              {inquiry.first_name.charAt(0)}
              {inquiry.last_name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg">
                {inquiry.company_name} - {inquiry.job_title}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(inquiry.status)}`}
              >
                {inquiry.status}
              </span>
            </div>
            <div className="text-gray-500">
              From: {inquiry.first_name} {inquiry.last_name}
            </div>
            <div className="text-gray-500 mt-1">{inquiry.message}</div>
            <div className="text-gray-400 text-sm mt-1">
              {formatDate(inquiry.created_at)}
            </div>
          </div>

          {/* Three Dots Button */}
          <div className="relative ml-4">
            <button
              onClick={() =>
                setMenuOpenId(menuOpenId === inquiry.id ? null : inquiry.id)
              }
              className="text-gray-600 hover:text-gray-900 text-3xl h-10 w-10 flex items-center justify-center"
              aria-label="Options"
            >
              &#x22EE;
            </button>

            {menuOpenId === inquiry.id && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded shadow-lg border z-10">
                <Link
                  to={`/admin/hire-inquiries/${inquiry.id}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpenId(null)}
                >
                  View
                </Link>
                <button
                  onClick={() => {
                    setSelectedInquiryId(inquiry.id);
                    setShowReplyModal(true);
                    setMenuOpenId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setSelectedInquiryId(inquiry.id);
                    setShowDeleteModal(true);
                    setMenuOpenId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {inquiries.length > PAGE_SIZE && (
        <div className="flex justify-end items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Reply to Inquiry</h3>
            <input
              type="text"
              placeholder="Subject"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="w-full px-4 py-2 border mb-3 rounded"
            />
            <textarea
              placeholder="Message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full px-4 py-2 border mb-4 rounded"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this inquiry?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
