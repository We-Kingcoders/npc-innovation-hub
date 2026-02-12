/**
 * AddResource Page
 *
 * Page for creating and editing resources
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import AddResourceForm from "../../components/admin-components/AddResourceForm";
import { useAdminResources } from "../../hooks/useAdminResources";
import type {
  Resource,
  CreateResourcePayload,
} from "../../types/resource.types";

// ==================== TOAST NOTIFICATION ====================

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`rounded-lg shadow-lg p-4 min-w-[300px] flex items-center gap-3 ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        {/* Icon */}
        {type === "success" ? (
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0"
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
        )}

        {/* Message */}
        <p
          className={`flex-1 text-sm font-medium ${
            type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${
            type === "success"
              ? "text-green-600 hover:text-green-800"
              : "text-red-600 hover:text-red-800"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function AddResource() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { createResource, updateResource, fetchResourceById, loading } =
    useAdminResources();

  // State
  const [initialData, setInitialData] = useState<Resource | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Check if editing
  useEffect(() => {
    const editId = searchParams.get("edit");

    if (editId) {
      setIsEditMode(true);

      // Try to get resource from location state first
      const stateResource = location.state?.resource as Resource | undefined;

      if (stateResource) {
        setInitialData(stateResource);
      } else {
        // Fetch resource if not in state
        fetchResourceById(editId).then((resource) => {
          if (resource) {
            setInitialData(resource);
          } else {
            showToast("Resource not found", "error");
            navigate("/resources");
          }
        });
      }
    }
  }, [searchParams, location.state]);

  // ==================== HANDLERS ====================

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (payload: CreateResourcePayload) => {
    let success = false;

    if (isEditMode && initialData) {
      // Update existing resource
      success = await updateResource(initialData.id, payload);

      if (success) {
        showToast("Resource updated successfully!", "success");
        setTimeout(() => navigate("/resources"), 2000);
      } else {
        showToast("Failed to update resource. Please try again.", "error");
      }
    } else {
      // Create new resource
      success = await createResource(payload);

      if (success) {
        showToast("Resource created successfully!", "success");
        setTimeout(() => navigate("/resources"), 2000);
      } else {
        showToast("Failed to create resource. Please try again.", "error");
      }
    }

    return success;
  };

  const handleCancel = () => {
    navigate("/resources");
  };

  // ==================== RENDER ====================

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <Topbar />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-2xl">
              {isEditMode ? "Edit Resource" : "Add New Resource"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? "Update resource details below"
                : "Fill in the details to create a new resource"}
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Resources
          </button>
        </div>

        {/* Form */}
        <AddResourceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={initialData}
          isLoading={loading}
        />

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </main>

      {/* CSS for Toast Animation */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
