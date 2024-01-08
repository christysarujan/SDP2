import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import { getAllSellers } from "../../services/apiService";
import { Modal, Button } from "react-bootstrap";
import {
  sellerAccountStateChange,
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

interface SellerInfo {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  profileStatus: string;
  dob: string;
  role: string;
  verificationStatus: string;
}

const SellerManagement = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sellerList, setSellerList] = useState<SellerInfo[] | null>(null);

  const [selectedSeller, setSelectedSeller] = useState<SellerInfo | null>(null);
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
    getAllSellerList();
  }, []);

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleShow = () => {
    setModalOpen(true);
  };

  const getAllSellerList = async () => {
    try {
      const response = await getAllSellers();
      setSellerList(response);
    } catch (error) {}
  };

  const openModal = (seller: SellerInfo) => {
    setSelectedSeller(seller);
    setModalOpen(true);

    // setModalOpen(true);
  };

    const sellerStateChange = async (id: any, action: string) => {
      // setModalOpen(false)
      try {
        const response = await sellerAccountStateChange(id, action);
        console.log('Method eke', response);

        if (response === 200) {
          handleClose();
          getAllSellerList()
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <div className="user-address-details">
      <div className="container">
        {sellerList ? (
          <div>
            <table className="table table-hover store-data-table">
              <thead>
                <tr>
                  <th className="col-md-1">#</th>
                  <th className="col-md-4">Seller Name</th>
                  <th className="col-md-3">Email</th>
                  <th className="col-md-2">Status</th>
                  <th className="col-md-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerList.map((seller: SellerInfo, index: number) => (
                  <tr key={seller.id}>
                    <td className="col-md-1">{index + 1}</td>
                    <td className="col-md-4">
                      {seller.firstName} {seller.firstName}
                    </td>
                    <td className="col-md-3">{seller.email}</td>

                    {seller.profileStatus === "SUSPEND" ? (
                      <td className="col-md-2 success-color">Suspend</td>
                    ) : (
                      <td className="col-md-2 danger-color">Active</td>
                    )}

                    <td className="col-md-2">
                      <div className="info-button-section">
                        <button
                          className="btn btn-primary view-info-btn"
                          onClick={() => openModal(seller)}
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


        <Modal
          show={modalOpen}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>Seller Informationt</Modal.Header>
          <Modal.Body>
            <p>
              <b>Seller Name:</b> {selectedSeller?.firstName}{" "}
              {selectedSeller?.lastName}
            </p>
            <p>
              <b>Username:</b> {selectedSeller?.username}
            </p>
            <p>
              <b>Seller Email:</b> {selectedSeller?.email}
            </p>
            <p>
              <b>Gender:</b> {selectedSeller?.gender}
            </p>
            <p>
              <b>Date of Birth:</b> {selectedSeller?.dob}
            </p>
            <p>
              <b>Profile Status:</b> {selectedSeller?.profileStatus}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="form-submit-btn"
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            {selectedSeller?.profileStatus === "SUSPEND" ? (
              <Button
                className="form-submit-btn"
                variant="success"
                onClick={() => sellerStateChange(selectedSeller?.id, 'active')}
              >
                Activate
              </Button>
            ) : (
              <Button
                className="form-submit-btn"
                variant="danger"
                onClick={() => sellerStateChange(selectedSeller?.id, 'suspend')}
              >
                Suspend
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SellerManagement;
