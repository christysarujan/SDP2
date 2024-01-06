import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
  paymentTypeFilterInitialValues,
  paymentTypeFilterValidationSchema,
} from "../../utils/Validation";
import "./storeRequests.scss";
import {
  addNewAddressInitialValues,
  addNewAddressValidationSchema,
} from "../../utils/Validation";
import { Tooltip } from "react-tooltip";
import {
  addUserAddress,
  deleteUserAddress,
  findUserByEmail,
  findUsersAddressByType,
  getPendingStoreApprovals,
} from "../../services/apiService";

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

interface StoreInfo {
  address: string;
  approvalDate: string;
  category: string;
  contactNo: string;
  country: string;
  createDate: string;
  name: string;
  sellerEmail: string;
  storeId: string;
  storeLogo: string;
  storeStatus: string;
}

const StoreRequests = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pendingStoreList, setPendingStoreList] = useState<StoreInfo[] | null>(
    null
  );
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");

    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      console.log("sasas", parsedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    getAllPendingStoreList();
    console.log("List eka", pendingStoreList);
  }, []);

  const getAllPendingStoreList = async () => {
    try {
      const response = await getPendingStoreApprovals();
      setPendingStoreList(response);
    } catch (error) {
      // console.error('Error in getUserDataByEmail:', error);
    }
  };
  const openModal = (store: StoreInfo) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStore(null);
    setModalOpen(false);
  };

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

  //   const deleteAddress = async (id: any) => {
  //     const addressDelete = await deleteUserAddress(id);
  //     getBillingAddress();
  //   };

  return (
    <div className="user-address-details">
      <div className="container">
        <br />

        {pendingStoreList ? (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Store Name</th>
                  <th>Category</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStoreList.map((store: StoreInfo, index: number) => (
                  <tr key={store.name}>
                    <td>{index + 1}</td>
                    <td>{store.name}</td>
                    <td>{store.category}</td>
                    <td>{store.country}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#storeDetailsModal"
                        onClick={() => openModal(store)}
                      >
                        View Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{" "}
          </div>
        ) : (
          <div>
            <p>No Data Available</p>
          </div>
        )}
        <div
          className="modal fade"
          id="storeDetailsModal"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">hello</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#storeDetailsModal"
                //   onClick={() => modalView()}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreRequests;
