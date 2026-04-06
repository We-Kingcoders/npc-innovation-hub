// src/api/member/task.api.ts

import client from "../client";

export const getAssignedTasks = () => client.get("/tasks/assigned");

export const getAssignedTaskById = (id: string) => client.get(`/tasks/${id}`);
