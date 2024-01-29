import { getRequest, postRequest, putRequest, deleteRequest } from ".";

export const getTasks = (lastCreatedAt?: string) => {
  return getRequest(`reminders?lastCreatedAt=${lastCreatedAt || ""}&direction=forwards`);
};

export const getPrevTasks = (lastCreatedAt?: string) => {
  return getRequest(`reminders?lastCreatedAt=${lastCreatedAt || ""}&direction=backwards`);
};

export const getTask = (id: string) => {
  return getRequest(`reminders/${id}`);
};

export const createTask = (data: { time: string; message: string }) => {
  return postRequest("reminders", data);
};

export const updateTask = (id: string, data: { time: string; message: string }) => {
  return putRequest(`reminders/${id}`, data);
};

export const deleteTask = (id: string) => {
  return deleteRequest(`reminders/${id}`);
};