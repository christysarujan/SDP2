import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
} from "../../utils/Validation";
import "./SellerProductList.scss";
import { Tooltip } from "react-tooltip";
import { findUserByEmail } from "../../services/apiService";

interface UserData {
  sub: string;
  role: string;
  verificationStatus: string;
  iss: string;
  exp: number;
  iat: number;
  email: string;
  username: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");

    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      console.log("sasas", parsedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const [addNewItem, setAddNewItem] = useState(false);
  const [buttonName, setButtonName] = useState("Add New Item");

  const addNewProductSubmit = async (values: any) => {};

  const name = "aa";
  const getUserDataByEmail = async () => {
    try {
      const response = await findUserByEmail("mgrwijethilaka@gmail.com");
      console.log("getByEmail", response);

      // Accessing the firstName property
      const firstName = response?.firstName;
      console.log("First Name:", firstName);

      // Now you can use the firstName in your React component's state or JSX
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleToggle = () => {
    setAddNewItem((prev) => !prev);
    if (addNewItem) {
      setButtonName("View Product List");
    } else {
      setButtonName("Add New Item");
    }
  };
  return (
    <div className="seller-product-list">
      <div className="container">
        
        <p className="addNewProdBtn" onClick={handleToggle}>
          {buttonName}
        </p>
        {addNewItem ? (
          <div>
            {" "}
            <table className="table table-striped item-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">1</td>
                  <td>
                    {" "}
                    <img
                      className="product-img"
                      src="https://media.licdn.com/dms/image/C5103AQEuXTCBE_RUEQ/profile-displayphoto-shrink_800_800/0/1568432085578?e=2147483647&v=beta&t=9Xpp44b5g1LtUmkYbI1oD69SnDGSaPiWH3qJ5PpDKko"
                      alt="Product-img"
                    />
                  </td>
                  <td>Hellio Frock</td>
                  <td>Womens</td>
                  <td>$25.99</td>
                  <td>
                    <i
                      className="bi bi-eye-fill actions-tab"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="View More"
                      data-tooltip-place="top"
                    ></i>
                    <i
                      className="bi bi-pencil-square actions-tab"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Edit"
                      data-tooltip-place="top"
                    ></i>
                    <i
                      className="bi bi-trash-fill"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Delete"
                      data-tooltip-place="top"
                    ></i>

                    <Tooltip id="my-tooltip" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {" "}
            <p>Test 1</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
