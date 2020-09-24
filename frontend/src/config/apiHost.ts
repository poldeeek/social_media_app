import axios from "axios";
import { getAccessToken, setAccessToken } from "../accessToken";

const apiHost = "http://localhost:5000";

export const authenticationHeader = () => {
  return {
    authorization: `Bearer ${getAccessToken()}`,
  };
};

export const api = axios.create({
  baseURL: apiHost,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// catching 401 status and refresh accessToken
const interceptor = api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    const originalRequest = error.config;
    console.log(originalRequest);

    if (status === 401) {
      originalRequest._retry = true;
      console.log("test");

      api.interceptors.response.eject(interceptor);

      fetch("http://localhost:5000/api/auth/refresh", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (res) => {
          console.log(res);
          await setAccessToken(res.accessToken);
          originalRequest.headers = authenticationHeader();
          return api(originalRequest);
        });
    }
    return Promise.reject(error);
  }
);
