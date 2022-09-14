import axios from "axios";
import { getAccessToken, updateAccessToken } from "./AuthService";


const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = {Authorization: `Bearer ${token}`};  // for Spring Boot back-end
      // config.headers["x-access-token"] = token; // for Node.js Express back-end
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/api/login/" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        if (await updateAccessToken()) {
          return instance(originalConfig);
        }
        else {
          return Promise.reject();
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;