/**
 * ApplicationDetail Component
 * Detail view for a single membership application with accept/reject actions
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApplication } from "../../hooks/useApplications";
import ConfirmationModal from "./ConfirmationModal";
import { RejectApplicationModal } from "./RejectApplicationModal";
import { Toast, useToast } from "./Toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    application,
    loading,
    error,
    fetchApplication,
    handleAccept,
    handleReject,
  } = useApplication(id || "");

  const { toast, showToast, hideToast } = useToast();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const confirmAccept = async () => {
    setIsAccepting(true);
    const result = await handleAccept();
    if (result.ok) {
      setShowAcceptModal(false);
      showToast(
        `Application accepted. ${result.application.fullName} will receive their login details by email.`,
        "success",
      );
    } else if (result.kind === "conflict") {
      setShowAcceptModal(false);
      showToast(`${result.message} — refreshing this page.`, "error");
      await fetchApplication();
    } else {
      showToast(
        `${result.message} Nothing was changed — you can try again.`,
        "error",
      );
    }
    setIsAccepting(false);
  };

  const confirmReject = async (reason: string) => {
    setIsRejecting(true);
    const result = await handleReject(reason ? { reason } : undefined);
    if (result.ok) {
      setShowRejectModal(false);
      showToast("Application rejected.", "success");
    } else if (result.kind === "conflict") {
      setShowRejectModal(false);
      showToast(`${result.message} — refreshing this page.`, "error");
      await fetchApplication();
    } else {
      showToast(
        `${result.message} Nothing was changed — you can try again.`,
        "error",
      );
    }
    setIsRejecting(false);
  };

  const isPending = application?.status === "Pending";

  return (
    <div className="flex min-h-screen bg-mist-100">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/applications")}
          className="mb-6 text-navy-700 font-medium hover:text-navy-800 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Applications
        </button>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-mist-200 rounded w-1/3" />
              <div className="h-4 bg-mist-200 rounded w-1/4" />
              <div className="h-4 bg-mist-200 rounded w-1/2" />
              <div className="h-32 bg-mist-200 rounded" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-navy-800 mb-2">
                Error Loading Application
              </h3>
              <p className="text-mist-600">{error}</p>
            </div>
          </div>
        )}

        {/* Detail View */}
        {application && !loading && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-navy-800 px-8 py-6 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {application.fullName}
                    </h1>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="text-navy-100">{application.email}</p>
                </div>
                {isPending && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAcceptModal(true)}
                      className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Accept
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Photo */}
              {application.imageUrl && (
                <img
                  src={application.imageUrl}
                  alt={application.fullName}
                  className="w-24 h-24 rounded-full object-cover border border-mist-300"
                />
              )}

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-navy-800 mb-4">
                  Applicant Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-mist-600">
                      Phone Number
                    </label>
                    <p className="text-navy-800 mt-1">
                      {application.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-mist-600">
                      Gender
                    </label>
                    <p className="text-navy-800 mt-1">{application.gender}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-mist-600">
                      GitHub
                    </label>
                    <p className="mt-1">
                      <a
                        href={application.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-700 hover:underline"
                      >
                        {application.githubUrl}
                      </a>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-mist-600">
                      Application Letter
                    </label>
                    <p className="mt-1">
                      <a
                        href={application.applicationLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-700 hover:underline"
                      >
                        Open Letter (PDF) →
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-semibold text-navy-800 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1.5 rounded-full font-medium bg-navy-50 text-navy-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h2 className="text-lg font-semibold text-navy-800 mb-4">
                  Strengths
                </h2>
                <div className="bg-mist-100 rounded-lg p-6 border border-mist-300">
                  <p className="text-navy-700 whitespace-pre-wrap">
                    {application.strengths}
                  </p>
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h2 className="text-lg font-semibold text-navy-800 mb-4">
                  Weaknesses
                </h2>
                <div className="bg-mist-100 rounded-lg p-6 border border-mist-300">
                  <p className="text-navy-700 whitespace-pre-wrap">
                    {application.weaknesses}
                  </p>
                </div>
              </div>

              {/* Review metadata */}
              {!isPending && (
                <div>
                  <h2 className="text-lg font-semibold text-navy-800 mb-4">
                    Review
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-mist-600">
                        Reviewed By
                      </label>
                      <p className="text-navy-800 mt-1">
                        {application.reviewedBy || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-mist-600">
                        Reviewed At
                      </label>
                      <p className="text-navy-800 mt-1">
                        {application.reviewedAt
                          ? formatDate(application.reviewedAt)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-mist-300">
                <div className="flex items-center justify-between text-sm text-mist-600">
                  <span>Submitted: {formatDate(application.createdAt)}</span>
                  <span>Last Updated: {formatDate(application.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={confirmAccept}
        title="Accept this application?"
        message={
          application
            ? `This creates a real member account for ${application.fullName} and emails them a temporary password. This can't be undone from here.`
            : ""
        }
        confirmText="Accept & Create Account"
        variant="warning"
        isLoading={isAccepting}
      />

      <RejectApplicationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={confirmReject}
        isLoading={isRejecting}
        applicantName={application?.fullName || ""}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
