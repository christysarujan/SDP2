import axios from "axios";
import { axiosInstance } from "./Interceptor";
import { useState } from "react";
import { toast } from "react-toastify";

const baseurl = "http://localhost:8080/api/v1";
const storeBaseurl = "http://localhost:8082/api/v1";

const userRegistration = async (userData: object) => {
  try {
    const response = await axios.post(
      `${baseurl}/auth-service/auth/register`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

const userLogin = async (loginData: any) => {
  try {
    const response = await axios.post(
      `${baseurl}/auth-service/auth/login`,
      loginData
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};
const getResetCode = async (resetEmail: any) => {
  try {
    const response = await axios.post(
      `${baseurl}/auth-service/auth/forgot-password`,
      resetEmail
    );
    toast.success(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};
const pwdResetCode = async (resetPwd: any) => {
  try {
    const response = await axios.post(
      `${baseurl}/auth-service/auth/password-reset`,
      resetPwd,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    toast.success(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

// const token = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJtZ3J3Iiwicm9sZSI6InNlbGxlciIsInZlcmlmaWNhdGlvblN0YXR1cyI6IlZFUklGSUVEIiwiaXNzIjoiZWNvbW1lcmNlX2F1dGhfc2VydmVyIiwiZXhwIjoxNzAyMjY1NTg0LCJpYXQiOjE3MDIwNDk1ODQsImVtYWlsIjoibWdyd2lqZXRoaWxha2FAZ21haWwuY29tIiwidXNlcm5hbWUiOiJtZ3J3In0.fpwOxGGE7hH512t9EQ5XiyhM0fdqmTuk2BSwpQ8E2DPk3_OCvZfKSz85lNx4AD0vqH5X1Rww_hqkmQaVBpyjwxYcQKn2ciY3LsnPtAE2GeBc0LXHWz1bJ2E4AU4FCtjKCuhYakGph17eQffv_78XWZbHFsMw6eJRixwDcJRrObMxWibCtKZ4eCJLfTe4NHig36z22064xNn_Yjr6YzFj-pnxFojg7NuFbx4SjmrbnowNHO1ezOra1yS_xcql3yQAkgZGQ15ew20NbK2UtdMc7vgoSrDag57vlmlHXza0jbpMinb6ON_0Ynm3JJ7NDaXpSd25JMCywhnf6OE3kdotGg'
const findUserByEmail = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${baseurl}/auth-service/users/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

/* Store Management */

const sellerStoreRegistration = async (storeData: object) => {
  try {
    const response = await axiosInstance.post(
      `${storeBaseurl}/seller-store-management-service/stores`,
      storeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

const findStoreByEmail = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/stores/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

export {
  userRegistration,
  userLogin,
  getResetCode,
  pwdResetCode,
  findUserByEmail,
  sellerStoreRegistration,
  findStoreByEmail,
};
