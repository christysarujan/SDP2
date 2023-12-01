import axios from 'axios';
import { useState } from 'react';

const baseurl = "http://localhost:8080/api/v1/auth-service";
// const [log, setLog] = useState<any>({});


const userRegistration = async (userData: object) => {
    try {
        const response = await axios.post(`${baseurl}/auth/register`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //   console.log(response.data);

        return response.data;
    } catch (error: any) {
        console.error(error.response.data);
    }
};

const userLogin = async (loginData: any) => {
    try {
        const response = await axios.post(`${baseurl}/auth/login`, loginData);
        // console.log(response.data);
        return response.data;

    } catch (error: any) {
        console.error(error.response.data);
    }
};
/* http://localhost:8080/api/v1/auth-service/auth/forgot-password */
const getResetCode = async (resetEmail: any) => {
    try {
        const response = await axios.post(`${baseurl}/auth/forgot-password`, resetEmail);
        // console.log(response.data);
        return response.data;

    } catch (error: any) {
        console.error(error.response.data);
    }
};
/* http://localhost:8080/api/v1/auth-service/auth/password-reset */
const pwdResetCode = async (resetPwd: any) => {
    try {
        const response = await axios.post(`${baseurl}/auth/password-reset`, resetPwd, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log(response.data);
        return response.data;

    } catch (error: any) {
        console.error(error.response.data);
    }
};

export { userRegistration, userLogin, getResetCode, pwdResetCode}
