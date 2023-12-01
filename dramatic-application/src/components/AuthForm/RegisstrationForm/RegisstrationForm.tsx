import React from 'react'
import { userRegistration } from '../../../services/apiService'

import { useState, useEffect } from 'react';

interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  gender: string;
  dob: string;
  role: string;
  mobileNo: string;
  profileImage: string;
}

const initialUserFormData = {
  firstName: "Gihan",
  lastName: "Ravindrajith",
  username: "mgrw",
  password: "1234",
  email: "mgrwijethilaka@gmail.com",
  gender: "male",
  dob: "1998-06-15",
  role: "user",
  mobileNo: "07712345678",
  profileImage: "https://i.imgflip.com/6yvpkj.jpg",
};

const RegisstrationForm =  () => {
    const [userFormDataString, setUserFormDataString] = useState<object>((initialUserFormData));
    const handleSubmit = async () => {

        console.log("Form Data Submitted:", userFormDataString);
        await userRegistration(userFormDataString);
      };
      

  return (
    <div>
      <button onClick={handleSubmit}>Test Button</button>
    </div>
  )
}

export default RegisstrationForm
