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
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string().required("DOB is required"),
});

/* Initial Values */

export const loginInitialValues = {
  username: "mgrw",
  password: "3333",
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
  mobileNo: "07712345678",
};
