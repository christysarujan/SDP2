import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import {
  getPendingStoreApprovals,
  rejectStoreRequest,
  approveStoreRequest,
  getRejectedStoreList,
  getActiveStoreList,
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
  const [activeStores, setActiveStores] = useState(true);
  const [pendingStores, setPendingStores] = useState(false);
  const [rejectedStores, setRejectedStores] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeStoreList, setActiveStoreList] = useState<StoreInfo[] | null>(
    null
  );
  const [pendingStoreList, setPendingStoreList] = useState<StoreInfo[] | null>(
    null
  );
  const [rejectedStoreList, setRejectedStoreList] = useState<
    StoreInfo[] | null
  >(null);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

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
    getAllActiveStoreList();
    getAllRejectedStoreList();
  }, []);

  const getAllActiveStoreList = async () => {
    try {
      const response = await getActiveStoreList();
      setActiveStoreList(response);
    } catch (error) {}
  };
  const getAllRejectedStoreList = async () => {
    try {
      const response = await getRejectedStoreList();
      setRejectedStoreList(response);
    } catch (error) {}
  };
  const getAllPendingStoreList = async () => {
    try {
      const response = await getPendingStoreApprovals();
      setPendingStoreList(response);
    } catch (error) {}
  };
  const openModal = (store: StoreInfo) => {
    setSelectedStore(store);
    // setModalOpen(true);
  };
  const viewActiveStores = () => {
    setActiveStores(true);
    setPendingStores(false);
    setRejectedStores(false);
  };
  const viewPendingStores = () => {
    setActiveStores(false);
    setPendingStores(true);
    setRejectedStores(false);
  };
  const viewRejectedStores = () => {
    setActiveStores(false);
    setPendingStores(false);
    setRejectedStores(true);
  };

  const rejectRequest = async (email: any) => {
    // setModalOpen(false)
    try {
      const response = await rejectStoreRequest(email);
      console.log(response);

      if (response === 200) {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const acceptRequest = async (email: any) => {
    // setModalOpen(false)
    try {
      const response = await approveStoreRequest(email);
      console.log(response);

      if (response === 200) {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="user-address-details">
      <div className="container">
        <div className="row sub-headings">
          <div
            className={`col  ${activeStores ? "active-button" : ""}`}
            onClick={() => viewActiveStores()}
          >
            Active Stores
          </div>
          <div
            className={`col  ${pendingStores ? "active-button" : ""}`}
            onClick={() => viewPendingStores()}
          >
            Pending Store Requests
          </div>
          <div
            className={`col  ${rejectedStores ? "active-button" : ""}`}
            onClick={() => viewRejectedStores()}
          >
            Rejected Stores
          </div>
        </div>
        {activeStores ? (
          <>
            {activeStoreList ? (
              <div>
                <table className="table table-hover store-data-table">
                  <thead>
                    <tr>
                      <th className="col-md-1">#</th>
                      <th className="col-md-4">Store Name</th>
                      <th className="col-md-3">Category</th>
                      <th className="col-md-2">Country</th>
                      <th className="col-md-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStoreList.map((store: StoreInfo, index: number) => (
                      <tr key={store.storeId}>
                        <td className="col-md-1">{index + 1}</td>
                        <td className="col-md-4">{store.name}</td>
                        <td className="col-md-3">{store.category}</td>
                        <td className="col-md-2">{store.country}</td>
                        <td className="col-md-2">
                          <div className="info-button-section">
                            <button
                              className="btn btn-primary view-info-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#storeDetailsModal"
                              onClick={() => openModal(store)}
                            >
                              View Info
                            </button>
                          </div>
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
          </>
        ) : pendingStores ? (
          <>
            {pendingStoreList ? (
              <div>
                <table className="table table-hover store-data-table">
                  <thead>
                    <tr>
                      <th className="col-md-1">#</th>
                      <th className="col-md-4">Store Name</th>
                      <th className="col-md-3">Category</th>
                      <th className="col-md-2">Country</th>
                      <th className="col-md-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStoreList.map((store: StoreInfo, index: number) => (
                      <tr key={store.storeId}>
                        <td className="col-md-1">{index + 1}</td>
                        <td className="col-md-4">{store.name}</td>
                        <td className="col-md-3">{store.category}</td>
                        <td className="col-md-2">{store.country}</td>
                        <td className="col-md-2">
                          <div className="info-button-section">
                            <button
                              className="btn btn-primary view-info-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#storeDetailsModal"
                              onClick={() => openModal(store)}
                            >
                              View Info
                            </button>
                          </div>
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
          </>
        ) : rejectedStores ? (
          <>
            {rejectedStoreList ? (
              <div>
                <table className="table table-hover store-data-table">
                  <thead>
                    <tr>
                      <th className="col-md-1">#</th>
                      <th className="col-md-4">Store Name</th>
                      <th className="col-md-3">Category</th>
                      <th className="col-md-2">Country</th>
                      <th className="col-md-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedStoreList.map(
                      (store: StoreInfo, index: number) => (
                        <tr key={store.storeId}>
                          <td className="col-md-1">{index + 1}</td>
                          <td className="col-md-4">{store.name}</td>
                          <td className="col-md-3">{store.category}</td>
                          <td className="col-md-2">{store.country}</td>
                          <td className="col-md-2">
                            <div className="info-button-section">
                              <button
                                className="btn btn-primary view-info-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#storeDetailsModal"
                                onClick={() => openModal(store)}
                              >
                                View Info
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>{" "}
              </div>
            ) : (
              <div>
                <p>No Data Available</p>
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        <div
          ref={modalRef}
          className="modal fade"
          id="storeDetailsModal"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">Store Creation Request</div>
              <div className="modal-body">
                <p>
                  <b>Store Name:</b> {selectedStore?.name}
                </p>
                <p>
                  <b>Category:</b> {selectedStore?.category}
                </p>
                <p>
                  <b>Seller Email:</b> {selectedStore?.sellerEmail}
                </p>
                <p>
                  <b>Contact Number:</b> {selectedStore?.contactNo}
                </p>
                <p>
                  <b>Address:</b> {selectedStore?.address}
                </p>
                <p>
                  <b>Country:</b> {selectedStore?.country}
                </p>
                <p>
                  <b>Requested Date:</b>{" "}
                  {selectedStore?.createDate &&
                    new Date(selectedStore?.createDate)
                      .toISOString()
                      .split("T")[0]}
                </p>
              </div>
              <div className="modal-footer">
                <div className="button-section">
                  <button
                    type="button"
                    className="btn btn-secondary footer-button"
                    data-bs-toggle="modal"
                    data-bs-target="#storeDetailsModal"
                  >
                    Close
                  </button>

                  {pendingStores ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger footer-button"
                        onClick={() =>
                          rejectRequest(selectedStore?.sellerEmail)
                        }
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-success footer-button"
                        onClick={() =>
                          acceptRequest(selectedStore?.sellerEmail)
                        }
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreRequests;
