/**
 * Event API Service
 * Handles all event-related API calls
 */

import apiClient from "../client";
import type {
  EventsResponse,
  EventResponse,
  CreateEventPayload,
  UpdateEventPayload,
  AttendeesResponse,
} from "../../types/event.types";

const EVENT_ROUTES = {
  GET_ALL_EVENTS: "/api/events",
  GET_EVENT_BY_ID: (id: string) => `/api/events/${id}`,
  CREATE_EVENT: "/api/events",
  UPDATE_EVENT: (id: string) => `/api/events/${id}`,
  DELETE_EVENT: (id: string) => `/api/events/${id}`,
  GET_EVENT_ATTENDEES: (id: string) => `/api/events/${id}/attendees`,
};

/**
 * Get all events
 */
export const getEvents = async (): Promise<EventsResponse> => {
  const response = await apiClient.get(EVENT_ROUTES.GET_ALL_EVENTS);
  return response.data as EventsResponse;
};

/**
 * Get event by ID
 */
export const getEvent = async (id: string): Promise<EventResponse> => {
  const response = await apiClient.get(EVENT_ROUTES.GET_EVENT_BY_ID(id));
  return response.data as EventResponse;
};

/**
 * Create new event
 */
export const createEvent = async (
  payload: CreateEventPayload,
): Promise<EventResponse> => {
  const response = await apiClient.post(EVENT_ROUTES.CREATE_EVENT, payload);
  return response.data as EventResponse;
};

/**
 * Update existing event
 */
export const updateEvent = async (
  id: string,
  payload: UpdateEventPayload,
): Promise<EventResponse> => {
  const response = await apiClient.patch(
    EVENT_ROUTES.UPDATE_EVENT(id),
    payload,
  );
  return response.data as EventResponse;
};

/**
 * Delete event
 */
export const deleteEvent = async (
  id: string,
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.delete(EVENT_ROUTES.DELETE_EVENT(id));
  return response.data as { status: string; message: string };
};

/**
 * Get event attendees
 */
export const getEventAttendees = async (
  id: string,
): Promise<AttendeesResponse> => {
  const response = await apiClient.get(EVENT_ROUTES.GET_EVENT_ATTENDEES(id));
  return response.data as AttendeesResponse;
};
