import axios, { AxiosError } from "axios";
import { axiosInstance } from "./Interceptor";
import { useState } from "react";
import { toast } from "react-toastify";
import CartData from '../components/Cart/cartData'
import CartQuantityData from "../components/Cart/cartQuantityData";

const baseurl = "http://localhost:8080/api/v1";
const storeBaseurl = "http://localhost:8082/api/v1";
const productBaseurl = "http://localhost:8083/api/v1/product-service";
const cartBaseurl = "http://localhost:8089/api/v1/shopping-cart-service";

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
    console.log("I am inside find User" , response.data)
    return response.data;
  } catch (error: any) {
    
    //console.error(error.response.data);
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


// Get Product Image
const getProductImage = async (imagename: any) => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products/images/${imagename}`,
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
const sellerAccountStateChange = async (id: any, action: string) => {
  try {
    const response = await axiosInstance.put(
      `${baseurl}/auth-service/users/seller/${id}/${action}`,
      
    );
    toast.success('Account Status Changed Successfully');
    console.log(response)
    return response.status;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
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

const getProductsByCategory = async (category: any) => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products/${category}`
    );
    console.log("Products By Catogory..",response.data)
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

  const editProduct = async (productData: object, id:string) => {
    try {
      const response = await axiosInstance.put(
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
  // http://localhost:8083/api/v1/product-service/products/6583e18590973a287d5f6ac7/update-color-variant
  const updateColorQuantity = async (data: object, id:string) => {
    try {
      const response = await axiosInstance.put(
        `${productBaseurl}/products/${id}/update-color-variant`,
        data,
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

  // Cart Management

  const addToCart = async (cartData: CartData): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        `${cartBaseurl}/cart/add`,
        cartData,
        {
          headers: {
            'Content-Type': 'application/json', // Change content type to JSON
          },
        }
      );
      toast.success('Product added to cart successfully');
      return response.data;
    } catch (error: unknown) { // Specify type annotation for 'error'
      if (axios.isAxiosError(error)) { // Check if error is an AxiosError
        const axiosError = error as AxiosError; // Cast error to AxiosError
        console.error('Error adding to cart:', axiosError.response?.data);
        toast.error('Failed to add product to cart');
        throw axiosError; // Rethrow error to handle it in the component
      } else {
        // Handle other types of errors
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart');
        throw error; // Rethrow error to handle it in the component
      }
    }
  };
  
  const updateCartQuantity = async (id:string , cartQuantityData: CartQuantityData) => {
    try {
      const response = await axiosInstance.put(
        `${cartBaseurl}/cart/update-quantity/${id}`,
        
        cartQuantityData,
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

  

  const getCartsByUserId = async (userId: any) => {
    try {
      const response = await axiosInstance.get(
        `${cartBaseurl}/cart/get/${userId}`
      );
      console.log("Get Carts By User..",response.data)
      return response.data;
    } catch (error: any) {
      // console.error(error.response.data);
    }
  };

  const deleteCartByUserIdAndCartId = async (userId: any , cartId : any) => {
    try {
      const response = await axiosInstance.delete(
        `${cartBaseurl}/cart/remove/${userId}/${cartId}`
      );
      toast.success("Cart deleted successfully");
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
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
  updateColorQuantity,
  rejectStoreRequest,
  approveStoreRequest,
  getActiveStoreList,
  getRejectedStoreList,
  getAllSellers,
  sellerAccountStateChange,
  addToCart,
  getProductsByCategory,
  getProductImage,
  updateCartQuantity,
  getCartsByUserId,
  deleteCartByUserIdAndCartId,
}