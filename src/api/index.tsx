import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getRequest = async (url: string) => {
  return await axios.get(`${BASE_URL}/${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("SWRL_USER_TOKEN")}`,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postRequest = async (url: string, data: any) => {
  return await axios.post(`${BASE_URL}/${url}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("SWRL_USER_TOKEN")}`,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putRequest = async (url: string, data: any) => {
  return await axios.put(`${BASE_URL}/${url}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("SWRL_USER_TOKEN")}`,
    },
  });
};

export const deleteRequest = async (url: string) => {
  return await axios.delete(`${BASE_URL}/${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("SWRL_USER_TOKEN")}`,
    },
  });
};