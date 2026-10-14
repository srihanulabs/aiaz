import axios, { AxiosResponse } from "axios";
import { error } from "next/dist/build/output/log";

export const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers.set("authToken", "123e4567-e89b-12d3-a456-426614174000");
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error),
);
