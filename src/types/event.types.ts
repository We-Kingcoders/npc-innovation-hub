/**
 * Event Type Definitions
 * TypeScript interfaces for event and attendance data structures
 */

export interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  imageUrl: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  creator?: Creator;
}

export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface Attendance {
  id: string;
  userId: string;
  eventId: string;
  status: "going" | "pending";
  createdAt: string;
  updatedAt: string;
  attendee: Attendee;
}

export interface CreateEventPayload {
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
}

export interface UpdateEventPayload {
  title?: string;
  location?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  imageUrl?: string;
}

export interface EventsResponse {
  status: string;
  results?: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  data: {
    events: Event[];
  };
}

export interface EventResponse {
  status: string;
  message?: string;
  data: {
    event: Event;
  };
}

export interface RSVPResponse {
  status: string;
  message: string;
  data: {
    attendance: {
      id: string;
      userId: string;
      eventId: string;
      status: "going";
      updatedAt: string;
      createdAt: string;
    };
  };
}

export interface AttendeesResponse {
  status: string;
  results: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: {
    attendances: Attendance[];
  };
}

export type EventStatus = "upcoming" | "past" | "all";
export type AttendanceStatus = "going" | "pending" | "all";

// Helper function to determine event status
export const getEventStatus = (event: Event): "upcoming" | "past" => {
  const now = new Date();
  const endTime = new Date(event.endTime);
  return endTime < now ? "past" : "upcoming";
};

// Helper function to format date range
export const formatEventDateRange = (
  startTime: string,
  endTime: string,
): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startDate = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const startTimeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTimeStr = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startDate} • ${startTimeStr} - ${endTimeStr}`;
};
