import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import {
  getPendingStoreApprovals,
  rejectStoreRequest,
  approveStoreRequest,
  getRejectedStoreList,
  getActiveStoreList,
} from "../../services/apiService";
import { Modal, Button, Form } from "react-bootstrap";

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
  rejectionReason: string;
}

const StoreRequests = () => {
  const [activeStores, setActiveStores] = useState(true);
  const [pendingStores, setPendingStores] = useState(false);
  const [rejectedStores, setRejectedStores] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeStoreList, setActiveStoreList] = useState<StoreInfo[] | null>(null);
  const [pendingStoreList, setPendingStoreList] = useState<StoreInfo[] | null>(null);
  const [rejectedStoreList, setRejectedStoreList] = useState<StoreInfo[] | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string>('');
  const [modalOpenConfirmRejection, setModalOpenConfirmRejection] = useState(false);


  const handleClose = () => {
    setModalOpen(false);

  };
  const handleShow = () => {
    setModalOpen(true);
  };


  const handleShowConfirmRejectionModal = () => {
    setSelectedStore(null);
    setRejectedReason('');
    setModalOpenConfirmRejection(true);
    // setModalOpenConfirmRejection(false)
  };

  const handleCloseConfirmRejectionModal = () => {
    setModalOpenConfirmRejection(false);
  };

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
    } catch (error) { }
  };
  const getAllRejectedStoreList = async () => {
    try {
      const response = await getRejectedStoreList();
      setRejectedStoreList(response);
    } catch (error) { }
  };
  const getAllPendingStoreList = async () => {
    try {
      const response = await getPendingStoreApprovals();
      setPendingStoreList(response);
    } catch (error) { }
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
  const openModal = (store: StoreInfo) => {
    setSelectedStore(store);
    handleShow();
  };

  const rejectRequest = async (email: any) => {
    // setModalOpen(false)
    try {
      const response = await rejectStoreRequest(email, rejectedReason);
      console.log(response);

      if (response === 200) {
        handleClose();
        getAllPendingStoreList();
        getAllActiveStoreList();
        getAllRejectedStoreList();
        handleShowConfirmRejectionModal(); // Open the Confirm Rejection modal
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
        handleClose();
        getAllPendingStoreList();
        getAllActiveStoreList();
        getAllRejectedStoreList();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const openConfirmRejectionModal = () => {
    setModalOpen(true);
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

        <Modal
          show={modalOpen}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>Store Creation Request</Modal.Header>
          <Modal.Body>

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

            {selectedStore?.storeStatus === "REJECTED" && (
              <p>
                <b>Rejected reason:</b> {selectedStore?.rejectionReason}
              </p>
            )}


            {selectedStore?.storeStatus === "VERIFIED" && (
              <p>
                <b>Requested Date:</b>{" "}
                {selectedStore?.createDate &&
                  new Date(selectedStore?.createDate).toISOString().split("T")[0]}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="form-submit-btn"
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            {selectedStore?.storeStatus === "PENDING" ? (
              <>
                <Button
                  className="form-submit-btn"
                  variant="danger"
                  onClick={() => rejectRequest(selectedStore?.sellerEmail)}
                >
                  Reject
                </Button>
                <Button
                  className="form-submit-btn"
                  variant="success"
                  onClick={() => acceptRequest(selectedStore?.sellerEmail)}
                >
                  Approve
                </Button>
              </>
            ) : selectedStore?.storeStatus === "VERIFIED" ? (
              <Button
                className="form-submit-btn"
                variant="danger"
                onClick={() => setModalOpenConfirmRejection(true)}
              >
                Reject
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>

        {/* Confirm Rejection Modal */}
        <Modal
          show={modalOpenConfirmRejection}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>Confirm Rejection</Modal.Header>
          <Modal.Body>
            <Form.Group controlId="rejectedReason">
              <Form.Label>Rejection Reason:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter reason for rejecting the store"
                value={rejectedReason}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setRejectedReason(e.target.value)
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="form-submit-btn"
              variant="secondary"
              onClick={handleCloseConfirmRejectionModal}
            >
              Cancel
            </Button>
            <Button
              className="form-submit-btn"
              variant="danger"
              onClick={() => {
                rejectRequest(selectedStore?.sellerEmail);
                handleCloseConfirmRejectionModal();
              }}
            >
              Confirm Reject
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StoreRequests;
