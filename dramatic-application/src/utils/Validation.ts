import * as Yup from "yup";

/* Validations */
export const loginValidationSchema = Yup.object({
  username: Yup.string().required("User Name is required"),
  password: Yup.string().required("Password is required"),
});

export const forgetPwdValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const resetPwdValidationSchema = Yup.object({
  code: Yup.string().required("Reset code is required"),
  password: Yup.string().required("New Password is required"),
  confirmPassword: Yup.string().required("Confirm Password is required"),
});

export const userRegValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, "Invalid characters before '@' in email")
    ,
  password: Yup.string().required("Password is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string().required("DOB is required"),
});

export const sellerStoreValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  contactNo: Yup.string().required("Contact no is required"),
  category: Yup.string().required("Category is required"),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
});
export const addNewItemValidationSchema = Yup.object({
  productName: Yup.string().required("Product Name is required"),
  category: Yup.string().required("Category is required"),
  material: Yup.string().required("Material is required"),
  price: Yup.string().required("Price is required"),
});
export const addNewPaymentTypeValidationSchema = Yup.object({
  paymentType: Yup.string().required("Payment Type is required"),
  accNumber: Yup.string().required("Account Number is required"),
  accHoldersName: Yup.string().required("Holder's Name is required"),
  bankName: Yup.string().required("Bank Name is required"),
  branchName: Yup.string().required("Branch Name is required"),
  paypalEmail: Yup.string().required("Email is required"),
  accountType: Yup.string().required("Account Type is required"),
  accountNumber: Yup.string().required("Account Number is required"),
});
export const addNewAddressValidationSchema = Yup.object({
  addressType: Yup.string().required("Address Type is required"),
  addressLine_01: Yup.string().required("Address Line 1 is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zipcode is required"),
  province: Yup.string().required("Province Name is required"),
  country: Yup.string().required("Country Name is required"),
  countryCode: Yup.string().required("Country Code is required"),
  mobileNo: Yup.string().required("Telephone Number is required"),

});

/* Initial Values */

export const loginInitialValues = {
  username: "mgrw",
  password: "1234",
};

export const forgetPwdInitialValues = {
  email: "mgrwijethilaka@gmail.com",
};

export const resetPwdInitialValues = {
  code: "",
  password: "",
  confirmPassword: "",
};

export const regFormInitialValues = {
  firstName: "Gihan",
  lastName: "Ravindrajith",
  username: "mgrw",
  password: "1234",
  email: "mgrwijethilaka@gmail.com",
  gender: "male",
  dob: "1998-06-15",
  role: "user",
};

export const sellerStoreFormInitialValues = {
  name: "Dark Pixel Studio",
  contactNo: "0775588760",
  category: "Digital Marketing",
  address: "No92/C, Pallegama, Pepiliyawala",
  country: "Sri Lanka",
};

export const addNewItemFormInitialValues = {
  productName: "",
  category: "",
  material: "",
  price: "",
  images: "",

}
export const addNewPaymentTypeInitialValues = {
  paymentType: "",
  accNumber: "",
  accHoldersName: "",
  bankName: "",
  branchName: "",
  paypalEmail: "",
  accountType: "",
  accountNumber: "",

}
export const addNewAddressInitialValues = {
  addressType: "",
  addressLine_1: "",
  addressLine_2: "",
  addressLine_3: "",
  zipCode: "",
  province: "",
  country: "",
  countryCode: "",
  telephoneNumber: "",

}
