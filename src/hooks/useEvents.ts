// /**
//  * useEvents Hook
//  * Custom hook for event management with state and API integration
//  */

// import { useState, useCallback } from "react";
// import type {
//   Event,
//   CreateEventPayload,
//   UpdateEventPayload,
// } from "../types/event.types";
// import {
//   getEvents,
//   getEvent,
//   createEvent,
//   updateEvent,
//   deleteEvent,
// } from "../api/admin/event.api";

// // Error extraction helper
// const extractErrorMessage = (error: unknown): string => {
//   if (error && typeof error === "object") {
//     if ("response" in error) {
//       const axiosError = error as {
//         response?: {
//           data?: { message?: string; error?: string };
//         };
//       };
//       return (
//         axiosError.response?.data?.message ||
//         axiosError.response?.data?.error ||
//         "An error occurred"
//       );
//     }
//     if ("message" in error) {
//       return (error as { message: string }).message;
//     }
//   }
//   return "An unexpected error occurred";
// };

// interface UseEventsReturn {
//   events: Event[];
//   loading: boolean;
//   error: string | null;
//   fetchEvents: () => Promise<void>;
//   fetchEventById: (id: string) => Promise<Event | null>;
//   handleCreateEvent: (payload: CreateEventPayload) => Promise<boolean>;
//   handleUpdateEvent: (
//     id: string,
//     payload: UpdateEventPayload,
//   ) => Promise<boolean>;
//   handleDeleteEvent: (id: string) => Promise<boolean>;
// }

// export const useEvents = (): UseEventsReturn => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEvents = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getEvents();
//       setEvents(response.data.events || []);
//     } catch (err) {
//       const message = extractErrorMessage(err);
//       setError(message);
//       console.error("Error fetching events:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchEventById = useCallback(
//     async (id: string): Promise<Event | null> => {
//       try {
//         const response = await getEvent(id);
//         return response.data.event || null;
//       } catch (err) {
//         console.error("Error fetching event:", err);
//         return null;
//       }
//     },
//     [],
//   );

//   const handleCreateEvent = useCallback(
//     async (payload: CreateEventPayload): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await createEvent(payload);
//         await fetchEvents(); // Refresh list
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error creating event:", err);
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchEvents],
//   );

//   const handleUpdateEvent = useCallback(
//     async (id: string, payload: UpdateEventPayload): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await updateEvent(id, payload);
//         await fetchEvents(); // Refresh list
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error updating event:", err);
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchEvents],
//   );

//   const handleDeleteEvent = useCallback(
//     async (id: string): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await deleteEvent(id);
//         // Optimistic update
//         setEvents((prev) => prev.filter((event) => event.id !== id));
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error deleting event:", err);
//         await fetchEvents(); // Revert on error
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchEvents],
//   );

//   return {
//     events,
//     loading,
//     error,
//     fetchEvents,
//     fetchEventById,
//     handleCreateEvent,
//     handleUpdateEvent,
//     handleDeleteEvent,
//   };
// };

// src/hooks/useEvents.ts

import { useState, useCallback } from "react";
import type {
  Event,
  EventsResponse,
  EventResponse,
} from "../types/event.types";
import {
  getAllEvents,
  getEventById,
  rsvpToEvent,
} from "../api/member/event.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if ("response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
        };
      };
      return (
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "An error occurred"
      );
    }
    if ("message" in error) {
      return (error as { message: string }).message;
    }
  }
  return "An unexpected error occurred";
};

interface UseEventsReturn {
  events: Event[];
  selectedEvent: Event | null;
  rsvpedEventIds: Set<string>;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  rsvp: (eventId: string) => Promise<boolean>;
  clearSelectedEvent: () => void;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEvents();
      const data = response.data as EventsResponse;
      setEvents(data.data?.events || []);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEventById(id);
      const data = response.data as EventResponse;
      setSelectedEvent(data.data?.event || null);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const rsvp = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      await rsvpToEvent(eventId);
      setRsvpedEventIds((prev) => new Set(prev).add(eventId));
      return true;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error RSVPing to event:", err);
      return false;
    }
  }, []);

  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return {
    events,
    selectedEvent,
    rsvpedEventIds,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    rsvp,
    clearSelectedEvent,
  };
};
