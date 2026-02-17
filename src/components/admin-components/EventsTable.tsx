/**
 * EventsTable Component
 * Modern admin table for event management with filters and modals
 */

import React from "react";
import { useState, useEffect, useRef } from "react";
import type { Event, EventStatus } from "../../types/event.types";
import { useEvents } from "../../hooks/useEvents";
import { EventFormModal } from "./EventFormModal";
import { EventDetailsModal } from "./EventDetailsModal";
import { EventAttendeesModal } from "./EventAttendeesModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";
import { getEventStatus, formatEventDateRange } from "../../types/event.types";

export default function EventsTable() {
  const {
    events,
    loading,
    error,
    fetchEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  } = useEvents();

  const { toast, showToast, hideToast } = useToast();
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EventStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || getEventStatus(event) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleActionMenu = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionMenuId(actionMenuId === eventId ? null : eventId);
  };

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event);
    return status === "upcoming" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Upcoming
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Past
      </span>
    );
  };

  // Handle create
  const handleCreate = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    const success = await handleCreateEvent({
      title: data.title,
      location: data.location,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      imageUrl: data.imageUrl,
    });

    if (success) {
      setIsCreateModalOpen(false);
      showToast("Event created successfully!", "success");
    } else {
      showToast(error || "Failed to create event", "error");
    }
    setIsSubmitting(false);
  };

  // Handle edit
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
    setActionMenuId(null);
  };

  const handleUpdate = async (data: Record<string, string>) => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    const success = await handleUpdateEvent(selectedEvent.id, {
      title: data.title,
      location: data.location,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      imageUrl: data.imageUrl,
    });

    if (success) {
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      showToast("Event updated successfully!", "success");
    } else {
      showToast(error || "Failed to update event", "error");
    }
    setIsSubmitting(false);
  };

  // Handle view details
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
    setActionMenuId(null);
  };

  // Handle view attendees
  const handleViewAttendees = () => {
    setIsDetailsModalOpen(false);
    setIsAttendeesModalOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
    setActionMenuId(null);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    const success = await handleDeleteEvent(selectedEvent.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
      showToast("Event deleted successfully!", "success");
    } else {
      showToast(error || "Failed to delete event", "error");
    }
    setIsSubmitting(false);
  };

  // Skeleton loader
  if (loading && events.length === 0) {
    return (
      <div className="ml-8 p-0">
        <div className="w-full max-w-[98%]">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-8 p-0">
      <div className="w-full max-w-[98%]">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search events by title, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EventStatus)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first event"}
            </p>
          </div>
        )}

        {/* Events Table */}
        {filteredEvents.length > 0 && (
          <table className="w-full bg-[#f4f6fa] rounded-t-2xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-[#343a5e] text-white text-left">
                <th className="px-6 py-4 rounded-tl-2xl">Event</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Event Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200";
                        }}
                      />
                      <div className="max-w-md">
                        <p className="font-semibold text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm max-w-xs truncate">
                        {event.location}
                      </span>
                    </div>
                  </td>

                  {/* Date Range */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {formatEventDateRange(event.startTime, event.endTime)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">{getStatusBadge(event)}</td>

                  {/* Actions */}
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={(e) => toggleActionMenu(event.id, e)}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                    </button>

                    {/* Action Menu */}
                    {actionMenuId === event.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-10"
                      >
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add New Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#343a5e] text-white rounded-xl px-10 py-3 font-bold text-lg shadow hover:bg-[#20253a] transition-all flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Event
          </button>
        </div>
      </div>

      {/* Modals */}
      <EventFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleUpdate}
        initialData={selectedEvent}
        isLoading={isSubmitting}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onViewAttendees={handleViewAttendees}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <EventAttendeesModal
        isOpen={isAttendeesModalOpen}
        onClose={() => {
          setIsAttendeesModalOpen(false);
        }}
        eventId={selectedEvent?.id || ""}
        eventTitle={selectedEvent?.title || ""}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        isLoading={isSubmitting}
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
