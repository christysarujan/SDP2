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

const getProfileImage = async (email: any) => {
    try {
      const response = await axiosInstance.get(
        `${baseurl}/auth-service/users/profileImage/${email}`
      ,{ responseType: 'blob' });
      return response.data;
    } catch (error: any) {
      // console.error(error.response.data);
    }
  };

  const addUserAddress = async (email:any, addressData:object) => {
    try {
      const response = await axiosInstance.post(
        `${baseurl}/auth-service/users/${email}/address`,
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Address Added Successfully.");
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
      toast.error(error.response.data);
    }
  };

  const findUsersAddressByType = async (email: any, addressType:any) => {
    try {
      const response = await axiosInstance.get(
        `${baseurl}/auth-service/users/${email}/${addressType}`
      );
      return response.data;
    } catch (error: any) {
      // console.error(error.response.data);
    }
  };
  const deleteUserAddress = async (id: any,) => {
    try {
      const response = await axiosInstance.delete(
        `${baseurl}/auth-service/users/address/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
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

const getStoreImage = async (email: any) => {
    try {
      const response = await axiosInstance.get(
        `${storeBaseurl}/seller-store-management-service/stores/storeLogo/${email}`
      ,{ responseType: 'blob' });
      return response.data;
    } catch (error: any) {
      // console.error(error.response.data);
    }
  };

  const sellerStoreEdit = async (storeData: object) => {
    try {
      const response = await axiosInstance.put(
        `${storeBaseurl}/seller-store-management-service/stores/updateStore`,
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

export {
  userRegistration,
  userLogin,
  getResetCode,
  pwdResetCode,
  findUserByEmail,
  sellerStoreRegistration,
  findStoreByEmail,
  getProfileImage,
  getStoreImage,
  addUserAddress,
  findUsersAddressByType,
  deleteUserAddress,
  sellerStoreEdit
};
