// src/api/member/event.api.ts

import client from "../client";

export const getAllEvents = () => client.get("/api/events");

export const getEventById = (id: string) => client.get(`/api/events/${id}`);

export const rsvpToEvent = (eventId: string) =>
  client.post(`/api/events/${eventId}/rsvp`);
