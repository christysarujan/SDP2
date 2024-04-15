import axios, { AxiosError } from "axios";
import { axiosInstance } from "./Interceptor";
import { useState } from "react";
import { toast } from "react-toastify";
import CartData from '../components/Cart/cartData'
import CartQuantityData from "../components/Cart/cartQuantityData";
import Feedback from "../components/FeedBack/FeedBack";
import CostData from "../components/Cart/costData";
import OrderData from "../components/OrderProduct/orderData";
import CostCalc from "../components/OrderProduct/costCalc";


const baseurl = "http://localhost:8080/api/v1";
const storeBaseurl = "http://localhost:8082/api/v1/seller-store-management-service";
const productBaseurl = "http://localhost:8083/api/v1/product-service";
const cartBaseurl = "http://localhost:8089/api/v1/shopping-cart-service";
const wishListBaseurl = "http://localhost:8088/api/v1/shopping-wishlist-service";
const feedbackBaseurl = "http://localhost:8095/api/v1/feedback-service";
const notificationBaseurl = "http://localhost:8087/api/v1/notification-service";
const costBaseUrl = "http://localhost:8086/api/v1/costing-service";
const authBaseUrl = "http://localhost:8080/api/v1/auth-service";
const orderBaseUrl = "http://localhost:8091/api/v1/order-management-service";


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
    //  console.log("I am inside find User" , response.data)
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
      `${storeBaseurl}/stores/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};


//SELLER MANAGEMENT

const getAllSellers = async () => {
  try {
    const response = await axiosInstance.get(
      `${baseurl}/auth-service/users/all/sellers`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};


 const suspendSellerByEmail = async (id: string, reason: string) => {
  try {
    const response = await axiosInstance.put(`${authBaseUrl}/users/seller/${id}/suspend`,
    { reason });
     toast.success(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to suspend seller by email');
  }
};

const activateSellerByEmail = async (id: string, reason: string) => {
  try {
    const response = await axiosInstance.put(`${authBaseUrl}/users/seller/${id}/active`,{ reason });
     toast.success(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to activate seller by email');
  }
};

const getSuspendedSellers = async () => {
  try {
    const response = await axiosInstance.get(
      `${authBaseUrl}/users/suspended/sellers`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error('Failed to fetch suspended sellers');
  }
};

const getActiveSellers = async () => {
  try {
    const response = await axiosInstance.get(
      `${authBaseUrl}/users/active/sellers`
    );
    
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error('Failed to fetch active sellers');
  }
};


const getStoreImage = async (email: any) => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/stores/storeLogo/${email}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const sellerStoreEdit  = async (formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `${storeBaseurl}/stores/updateStore`,
      formData,
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
      `${storeBaseurl}/seller-payment-details/${email}`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const paymentDataSubmit = async (email: any, bankType: any, data: any) => {
  try {
    const response = await axios.post(
      `${storeBaseurl}/seller-payment-details/${email}?payment-method=${bankType}`,
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
      `${storeBaseurl}/seller-payment-details/update/${email}?payment-method=${bankType}`,
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
      `${storeBaseurl}/stores/all/pending`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};
const getActiveStoreList = async () => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/stores/all/verified`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const getRejectedStoreList = async () => {
  try {
    const response = await axiosInstance.get(
      `${storeBaseurl}/stores/all/rejected`
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};


const  rejectStoreRequest = async (email: any, rejectionReason:String) => {
  try {
    const response = await axiosInstance.put(
      `${storeBaseurl}/stores/reject/${email}`,
      {
        rejectionReason, // Include rejectionReason in the request body
      },
      {
        headers: {
          "Content-Type": "application/json", // Use application/json content type
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
      `${storeBaseurl}/stores/verify/${email}`,
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

/* SELLER MANAGEMENT */

export const suspendSeller = async (sellerId: string, reason: string) => {
  try {
    const response = await axios.put(`${storeBaseurl}/stores/suspend/${sellerId}`, null, {
      params: { reason },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to suspend seller');
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
    console.log("Products By Catogory..", response.data)
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
const updateColorQuantity = async (data: object, id: string) => {
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


const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get(
      `${productBaseurl}/products`);
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};


const productAccountStateChange = async (id: any, action: string) => {
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

const unpublishProduct = async (id: string, reason: string) => {
  try {
    const response = await axiosInstance.put(
      `${productBaseurl}/products/${id}/un-publish`,
      { reason },  // Sending reason as a JSON object
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    toast.success(response.data);
    return response.data;

  } catch (error) {
    throw error;
  }
};

const applyDiscount = async (id: any, discount: any) => {
  try {
    const response = await axiosInstance.post(
      `${productBaseurl}/products/discount/${id}/${discount}`,

    );
    toast.success("Discont Added Successfully");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

const updateDiscount = async (id: any, discount: any) => {
  try {
    const response = await axiosInstance.put(
      `${productBaseurl}/products/updateDiscount/${id}/${discount}`,

    );
    toast.success("Discont Updated Successfully");
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

const updateCartQuantity = async (id: string, cartQuantityData: CartQuantityData) => {
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
    console.log("Get Carts By User..", response.data)
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const getCartById = async (cartId: any) => {
  try {
    const response = await axiosInstance.get(
      `${cartBaseurl}/cart/${cartId}`
    );
    console.log("Get Carts By Id..", response.data)
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const deleteCartByUserIdAndCartId = async (userId: any, cartId: any) => {
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


//// WishList Management

const addToWishList = async (cartData: CartData): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${wishListBaseurl}/wishlist/add`,
      cartData,
      {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
        },
      }
    );
    toast.success('Product added to Wish List Successfully');
    return response.data;
  } catch (error: unknown) { // Specify type annotation for 'error'
    const axiosError = error as AxiosError | undefined;
    if (axiosError?.response?.data) {
      const responseData = axiosError.response.data;
      if (typeof responseData === 'string') {
        toast.error(responseData);
      } else {
        toast.error(JSON.stringify(responseData));
      }
    } else {
      // Handle other types of errors
      console.error(error);
    }
  }
};

const getWishListByUserId = async (userId: any) => {
  try {
    const response = await axiosInstance.get(
      `${wishListBaseurl}/wishlist/get/${userId}`
    );
    console.log("Get wishlist By User..", response.data)
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};

const deleteWishByWishId = async (wishId: any) => {
  try {
    const response = await axiosInstance.delete(
      `${wishListBaseurl}/wishlist/remove/wishlistId/${wishId}`
    );
    toast.success("Wish deleted successfully");
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

// Review Management

const addToReviewFeedback = async (feedback: Feedback, files: File[]): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('userId', feedback.userId);
    formData.append('productId', feedback.productId);
    formData.append('comment', feedback.comment);
    formData.append('rating', feedback.rating.toString());

    // Append each selected file to the FormData object
    files.forEach((file) => {
      formData.append('uploadImages', file);
    });

    const response = await axiosInstance.post(`${feedbackBaseurl}/feedback/addFeedback`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Change content type to multipart form data
      },
    });

    toast.success('Review added Successfully');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError | undefined;
    if (axiosError?.response?.data) {
      const responseData = axiosError.response.data;
      if (typeof responseData === 'string') {
        toast.error(responseData);
      } else {
        toast.error(JSON.stringify(responseData));
      }
    } else {
      // Handle other types of errors
      console.error(error);
    }
  }
};

const getFeedBackById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${feedbackBaseurl}/feedback/getFeedback/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};


// Get Feedback Image
const getFeedBackImage = async (imagename: any) => {
  try {
    const response = await axiosInstance.get(
      `${feedbackBaseurl}/feedback/images/${imagename}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
};


/*Cost Management*/

const calculateCost = async (costData: CostData): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${costBaseUrl}/costs/calculation`,
      costData,
      {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
        },
      }
    );
    // toast.success('Calculated Cost successfully');
    return response.data;
  } catch (error: unknown) { // Specify type annotation for 'error'
    if (axios.isAxiosError(error)) { // Check if error is an AxiosError
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Error adding to cart:', axiosError.response?.data);
      toast.error('Calculated Cost Failed');
      throw axiosError; // Rethrow error to handle it in the component
    } else {
      // Handle other types of errors
      console.error('Error Calculatoing cost:', error);
      toast.error('Failed to calculate Cost');
      throw error; // Rethrow error to handle it in the component
    }
  }
};


const calculateCostByOrderIdandProductId = async (costCalc: CostCalc): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${costBaseUrl}/costs/calculation`,
      costCalc,
      {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
        },
      }
    );
   // toast.success('Calculated Cost successfully by order and product');
    return response.data;
  } catch (error: unknown) { // Specify type annotation for 'error'
    if (axios.isAxiosError(error)) { // Check if error is an AxiosError
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Error adding to cart:', axiosError.response?.data);
      toast.error('Calculated Cost Failed');
      throw axiosError; // Rethrow error to handle it in the component
    } else {
      // Handle other types of errors
      console.error('Error Calculatoing cost:', error);
      toast.error('Failed to calculate Cost');
      throw error; // Rethrow error to handle it in the component
    }
  }
};



const getcostById = async (costId: string) => {
  try {
    const response = await axiosInstance.get(
      `${costBaseUrl}/costs/${costId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    throw error;
  }
};



const getAllNotificationsBySellerEmail = async (sellerEmail: string) => {
  try {
    const response = await axiosInstance.get(
      `${notificationBaseurl}/notifications/all/${sellerEmail}`
    );
    console.log("LLL", response.data)
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    throw error;
  }
};

const updateNotificationStatus = async (notificationId: string) => {
  try {
    const response = await axios.put(
      `${notificationBaseurl}/notifications/update-notification-status/${notificationId}`
    );
    toast.success(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    toast.error(error.response.data);
  }
};

// Order Management

const addOrder = async (orderData: OrderData): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${orderBaseUrl}/orders/add`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
        },
      }
    );
    toast.success('Order Added successfully');
    return response.data;
  } catch (error: unknown) { // Specify type annotation for 'error'
    if (axios.isAxiosError(error)) { // Check if error is an AxiosError
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Error adding Order:', axiosError.response?.data);
      toast.error('Failed to add Order');
      throw axiosError; // Rethrow error to handle it in the component
    } else {
      // Handle other types of errors
      console.error('Error adding to order:', error);
      toast.error('Failed to add product to order');
      throw error; // Rethrow error to handle it in the component
    }
  }
};


const getOrderById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `${orderBaseUrl}/orders/${id}`,
      
      {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
        },
      }
    );
   // toast.success('Order Got successfully');
    return response.data;
  } catch (error: unknown) { // Specify type annotation for 'error'
    if (axios.isAxiosError(error)) { // Check if error is an AxiosError
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Error getting Order:', axiosError.response?.data);
      toast.error('Failed to add Order');
      throw axiosError; // Rethrow error to handle it in the component
    } else {
      // Handle other types of errors
      console.error('Error adding to order:', error);
      toast.error('Failed to add product to order');
      throw error; // Rethrow error to handle it in the component
    }
  }
};


const searchByQuery = async(name:string) =>{

  try {
     const response = await axiosInstance.get(`http://localhost:8083/api/v1/product-service/products/search?name=${name}`,    {
    // const response = await axiosInstance.get(`http://localhost:8083/api/v1/product-service/products/women`,    {
      headers: {
        'Content-Type': 'application/json', 
      },
    })
    return response.data;
    
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) { // Check if error is an AxiosError
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Error getting Order:', axiosError.response?.data);
      toast.error('Failed to add Order');
      throw axiosError; // Rethrow error to handle it in the component
    } else {
      // Handle other types of errors
      console.error('Error adding to order:', error);
      toast.error('Failed to add product to order');
      throw error; // Rethrow error to handle it in the component
    }
  }


}



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
  productAccountStateChange,
  getAllProducts,
  unpublishProduct,
  addToWishList,
  getWishListByUserId,
  deleteWishByWishId,
  addToReviewFeedback,
  getFeedBackById,
  getFeedBackImage,
  getAllNotificationsBySellerEmail,
  updateNotificationStatus,
  applyDiscount,
  updateDiscount,
  calculateCost,
  getCartById,
  getcostById,
  suspendSellerByEmail,
  activateSellerByEmail,
  getSuspendedSellers,
  getActiveSellers,
  addOrder,
  calculateCostByOrderIdandProductId,
  getOrderById,
  searchByQuery
}