import axios from 'axios';

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userString = sessionStorage.getItem("userData");

    if (userString) {
      const user = JSON.parse(userString);

      if (user && user.accessToken) {
        console.log("Axios interceptor created with a bearer token!!");
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
