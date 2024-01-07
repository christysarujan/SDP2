import axios from "axios";
import { axiosInstance } from "./Interceptor";
import { useState } from "react";
import { toast } from "react-toastify";

const baseurl = "http://localhost:8080/api/v1";
const storeBaseurl = "http://localhost:8082/api/v1";
const productBaseurl = "http://localhost:8083/api/v1/product-service";

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
const changePassword = async (email: any, userData: object) => {
  try {
    const response = await axiosInstance.post(
      `${baseurl}/auth-service/users/${email}/change-password`,
      userData,
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
      `${baseurl}/auth-service/users/profileImage/${email}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const addUserAddress = async (email: any, addressData: object) => {
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
const updateUser = async (email: any, userData: object) => {
  try {
    console.log(`${baseurl}/auth-service/auth/${email}/update`);
    const response = await axiosInstance.put(
      `${baseurl}/auth-service/auth/${email}/update`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Details Updated Successfully.");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

const findUsersAddressByType = async (email: any, addressType: any) => {
  try {
    const response = await axiosInstance.get(
      `${baseurl}/auth-service/users/${email}/${addressType}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};
const deleteUserAddress = async (id: any) => {
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
const getAllSellers = async () => {
  try {
    const response = await axiosInstance.get(
      `${baseurl}/auth-service/users/all/sellers`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const getStoreImage = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/stores/storeLogo/${email}`,
      { responseType: "blob" }
    );
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

const getSellerPaymentInfoByEmail = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/seller-payment-details/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const paymentDataSubmit = async (email: any, bankType: any, data: any) => {
  try {
    const response = await axios.post(
      `${storeBaseurl}/seller-store-management-service/seller-payment-details/${email}?payment-method=${bankType}`,
      data
    );
    toast.success("Payment Details Added Successfully");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};
const paymentDataEdit = async (email: any, bankType: any, data: any) => {
  try {
    const response = await axios.put(
      `${storeBaseurl}/seller-store-management-service/seller-payment-details/update/${email}?payment-method=${bankType}`,
      data
    );
    toast.success("Payment Details Edit Successfully");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

const getPendingStoreApprovals = async () => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/stores/all/pending`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};
const getActiveStoreList = async () => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/stores/all/verified`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};
const getRejectedStoreList = async () => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/seller-store-management-service/stores/all/rejected`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const rejectStoreRequest = async (email: any) => {
  try {
    const response = await axiosInstance.put(
      `${storeBaseurl}/seller-store-management-service/stores/reject/${email}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Request Rejected Successfully");
    return response.status;
  } catch (error: any) {
    console.error(error.response.data);
  }
};
const approveStoreRequest = async (email: any) => {
  try {
    const response = await axiosInstance.put(
      `${storeBaseurl}/seller-store-management-service/stores/verify/${email}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Request Approved Successfully");
    return response.status;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

/* Product Management */
const addProduct = async (productData: object) => {
  try {
    const response = await axios.post(
      `${productBaseurl}/products/add-product`,
      productData,
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

const getProductsBySellerEmail = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products/all/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const getProductImages = async (name: any) => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products/images/${name}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const deleteProduct = async (id: any) => {
  try {
    const response = await axiosInstance.delete(
      `${productBaseurl}/products/${id}`
    );
    toast.success("Product deleted successfully");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

const getProductsByProductId = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products/get/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

const editProduct = async (productData: object, id: string) => {
  try {
    const response = await axios.put(
      `${productBaseurl}/products/updateProduct/${id}`,
      productData,
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
  changePassword,
  findUserByEmail,
  sellerStoreRegistration,
  findStoreByEmail,
  getProfileImage,
  getStoreImage,
  addUserAddress,
  findUsersAddressByType,
  deleteUserAddress,
  sellerStoreEdit,
  getSellerPaymentInfoByEmail,
  paymentDataSubmit,
  getPendingStoreApprovals,
  addProduct,
  paymentDataEdit,
  updateUser,
  getProductsBySellerEmail,
  getProductImages,
  deleteProduct,
  getProductsByProductId,
  editProduct,
  rejectStoreRequest,
  approveStoreRequest,
  getActiveStoreList,
  getRejectedStoreList,
  getAllSellers,
}