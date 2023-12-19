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
export const sellerStoreEditValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  contactNo: Yup.string().required("Contact no is required"),
  category: Yup.string().required("Category is required"),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
});
export const addNewItemValidationSchema = Yup.object({
  name: Yup.string().required("Product Name is required"),
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
export const paymentTypeFilterValidationSchema = Yup.object({
  addressType: Yup.string().required("Please Select an Address Type"),
});
export const paypalFormValidationSchema = Yup.object({
  paypalEmail: Yup.string().required("Paypal email is required"),
  accountType: Yup.string().required("Account type is required"),
  paypalAccountNo: Yup.string().required("Paypal account No is required"),
});
export const bankFormValidationSchema = Yup.object({
  accountNo: Yup.string().required("Account no is required"),
  accountHolderName: Yup.string().required("Account holder name is required"),
  bankName: Yup.string().required("Bank Name is required"),
  branch: Yup.string().required("Branch is required"),
});

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
  username: "mg",
  password: "1234",
  email: "gwijethilaka@virtusa.com",
  gender: "male",
  dob: "1998-06-15",
  role: "user",
};

export const sellerStoreFormInitialValues = {
  name: "Dark Pixel Studio",
  category: "Digital Marketing",
  address: "No92/C, Pallegama, Pepiliyawala",
  country: "Sri Lanka",
  contactNo: "0775588760",
};
export const sellerStoreEditFormInitialValues = {
  name: "Dark Pixel Studio",
  category: "Digital Marketing",
  address: "No92/C, Pallegama, Pepiliyawala",
  country: "Sri Lanka",
  contactNo: "0775588760",
};

export const addNewItemFormInitialValues = {
  name: "",
  category: "",
  material: "",
  price: 0,
  variation:[{"color":"", "quantity":"", "size":""}]

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
  addressLine_01: "",
  addressLine_02: "",
  city: "",
  zipCode: "",
  province: "",
  country: "",
  countryCode: "",
  mobileNo: "",

}
export const paymentTypeFilterInitialValues = {
  paymentType: "",
}

export const paypalFormInitialValues = {
  paypalEmail: "",
  accountType: "",
  paypalAccountNo: "",
};
export const bankFormInitialValues = {
  accountNo: "",
  accountHolderName: "",
  bankName: "",
  branch: "",
};
/* export const addNewAddressInitialValues = {
  addressType: "shipping",
  addressLine_01: "No:92/C, Hanwella Road",
  addressLine_02: "Pallegama, Pepiliyawala",
  city: "Kirindiwela",
  zipCode: "1131",
  province: "Western",
  country: "LK",
  countryCode: "94",
  mobileNo: "0758011310",

} */

/* Initial Values */

/* export const loginInitialValues = {
  username: "",
  password: "",
};

export const forgetPwdInitialValues = {
  email: "",
};

export const resetPwdInitialValues = {
  code: "",
  password: "",
  confirmPassword: "",
};

export const regFormInitialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  email: "",
  gender: "",
  dob: "",
  role: "",
};

export const sellerStoreFormInitialValues = {
  name: "",
  category: "",
  address: "",
  country: "",
  contactNo: "",
}; */