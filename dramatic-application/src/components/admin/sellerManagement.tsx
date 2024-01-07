import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import {
  getAllSellers,
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
    id:string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dob: string;
    role: string;
    verificationStatus: string;

}


const SellerManagement = () => {


  const [userData, setUserData] = useState<UserData | null>(null);
  const [sellerList, setSellerList] = useState<SellerInfo[] | null>(
    null
  );

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

  const getAllSellerList = async () => {
    try {
      const response = await getAllSellers();
      setSellerList(response);

    } catch (error) {}
  };

  const openModal = (seller: SellerInfo) => {
    setSelectedSeller(seller);
    // setModalOpen(true);
  };


//   const rejectRequest = async (email: any) => {
//     // setModalOpen(false)
//     try {
//       const response = await rejectStoreRequest(email);
//       console.log(response);

//       if (response === 200) {
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };


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
                        <td className="col-md-4">{seller.firstName}{' '}{seller.firstName}</td>
                        <td className="col-md-3">{seller.email}</td>
                        <td className="col-md-2">{seller.verificationStatus}</td>
                        <td className="col-md-2">
                          <div className="info-button-section">
                            <button
                              className="btn btn-primary view-info-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#storeDetailsModal"
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
              <div className="modal-header">Seller Details</div>
              <div className="modal-body">
                <p>
                  <b>Seller Name:</b> {selectedSeller?.firstName}{' '}{selectedSeller?.lastName}
                </p>
                <p>
                  <b>Username:</b> {selectedSeller?.username}
                </p>
                <p>
                  <b>Seller Email:</b> {selectedSeller?.email}
                </p>
                <p>
                  <b>Contact Number:</b> {selectedSeller?.gender}
                </p>
                <p>
                  <b>Address:</b> {selectedSeller?.dob}
                </p>
                <p>
                  <b>Country:</b> {selectedSeller?.verificationStatus}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerManagement;
