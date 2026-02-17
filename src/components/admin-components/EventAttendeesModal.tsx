/**
 * EventAttendeesModal Component
 * Modal for viewing event attendees with filtering
 */

import React from "react";
import { useState, useEffect } from "react";
import type { AttendanceStatus } from "../../types/event.types";
import { useEventAttendees } from "../../hooks/useEventAttendees";

interface EventAttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}) => {
  const { attendees, loading, error, fetchAttendees } = useEventAttendees();
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus>("all");

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees(eventId);
    }
  }, [isOpen, eventId, fetchAttendees]);

  const filteredAttendees = attendees.filter(
    (attendance) =>
      statusFilter === "all" || attendance.status === statusFilter,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Event Attendees</h2>
              <p className="text-indigo-100">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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
        </div>

        {/* Filter */}
        <div className="px-8 py-4 border-b border-gray-200">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AttendanceStatus)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Attendees</option>
            <option value="going">Going</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading attendees...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-red-400 mx-auto mb-3"
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
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attendees found
              </h3>
              <p className="text-gray-600">
                {statusFilter !== "all"
                  ? "Try changing the filter"
                  : "No one has registered for this event yet"}
              </p>
            </div>
          )}

          {!loading && filteredAttendees.length > 0 && (
            <div className="space-y-3">
              {filteredAttendees.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Avatar */}
                  {attendance.attendee.image ? (
                    <img
                      src={attendance.attendee.image}
                      alt={attendance.attendee.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(
                            `${attendance.attendee.firstName} ${attendance.attendee.lastName}`,
                          );
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                      {attendance.attendee.firstName[0]}
                      {attendance.attendee.lastName[0]}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {attendance.attendee.firstName}{" "}
                      {attendance.attendee.lastName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {attendance.attendee.email}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      attendance.status === "going"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {attendance.status === "going" ? "Going" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {!loading && attendees.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Total Attendees:{" "}
                  <strong className="text-gray-900">{attendees.length}</strong>
                </span>
                <span>
                  Showing:{" "}
                  <strong className="text-gray-900">
                    {filteredAttendees.length}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
