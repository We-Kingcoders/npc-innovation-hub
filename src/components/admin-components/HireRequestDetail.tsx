import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { HireInquiry } from "../../data/admin-data/HireRequest";
import Sidebar from "../../components/admin-components/Sidebar";

export default function HireRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<HireInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://npc-innovation-hub-bn.onrender.com/api/admin/hire-inquiries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inquiry");
        }

        const data = await response.json();
        setInquiry(data.data.inquiry);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id, token]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar user={{ name: "Admin" }} />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 font-medium hover:underline"
        >
          ← Back
        </button>

        {loading && (
          <div className="text-center py-10 text-gray-600">Loading...</div>
        )}

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {inquiry && (
          <div className="bg-white rounded-xl p-6 shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              {inquiry.company_name} - {inquiry.job_title}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>From:</strong> {inquiry.first_name} {inquiry.last_name}
              </p>
              <p>
                <strong>Email:</strong> {inquiry.email}
              </p>
              <p>
                <strong>Message:</strong> {inquiry.message}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{inquiry.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Created:{" "}
                {new Date(inquiry.created_at).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
