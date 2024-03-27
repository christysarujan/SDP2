import React, { ChangeEvent, useEffect, useState } from "react";
import "./sellerManagement.scss";
import { getAllSellers, activateSellerByEmail, suspendSellerByEmail, getSuspendedSellers, getActiveSellers } from "../../services/apiService";
import { Modal, Button, Form } from "react-bootstrap";

interface SellerInfo {
  sellerId: string
  username: string;
  email: string;
  profileStatus: string;
  dob : number;
  gender: string;
  reason: string;
  id: any;
  
}

const SellerManagement = () => {
  const [activeSellers, setActiveSellers] = useState(true);
  const [suspendedStores, setSuspendedSellers] = useState(true);
  const [sellerList, setSellerList] = useState<SellerInfo[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<SellerInfo | null>(null);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [reason, setreason,] = useState('');
  const [sellerDetailsModalOpen, setSellerDetailsModalOpen] = useState(false);
  const [selectedSellerDetails, setSelectedSellerDetails] = useState<SellerInfo | null>(null);

  useEffect(() => {
    viewActiveSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const allSellers = await getAllSellers();
      setSellerList(allSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };


  const openSuspendModal = (seller: SellerInfo) => {
    setSelectedSeller(seller);
    setSuspendModalOpen(true);
  };
  const handleCloseSuspendModal = () => {
    setSuspendModalOpen(false);
    setSuspendReason('');
    viewSuspendedSellers();
  
  };

  const handleCloseActiveModal = () => {
    setSuspendModalOpen(false);
    setSuspendReason('');
    viewActiveSellers();
    window.location.reload();
  };
  const handleOpenSuspendModal = () => {
    setSuspendModalOpen(true);
    setSuspendReason('');
  };

  // const handleSuspend = async () => {
  //   if (selectedSellerDetails && suspendReason) {
  //     try {
  //       await suspendSellerByEmail(selectedSellerDetails.id, suspendReason);
  //       fetchSellers();
  //       handleCloseSuspendModal(); // Close the suspend modal after success
  //     } catch (error) {
  //       console.error("Error suspending seller:", error);
  //     }
  //   }
  // };

  // const handleActivate = async () => {
  //   console.log("here is the method handleActivate")
  //   if (selectedSellerDetails) {
  //     try {
  //       await activateSellerByEmail(selectedSellerDetails.id, reason);
  //       fetchSellers();
  //       handleCloseSuspendModal();
  //     } catch (error) {
  //       console.error("Error activating seller:", error);
  //     }
  //   }
  // };

  const handleAction = async () => {
    if (selectedSellerDetails) {
      if (selectedSellerDetails.profileStatus == 'ACTIVE') {
       
        console.log("suspended reason>>",suspendReason)

       
        await suspendSellerByEmail(selectedSellerDetails.id, suspendReason);
        window.location.reload();
        handleCloseSuspendModal();
        
        // viewActiveSellers();
       
        
      } else {
        console.log("activate seller method callled in handleaction method!!!!!!")
        await activateSellerByEmail(selectedSellerDetails.id, suspendReason);
        handleCloseSuspendModal();
        viewSuspendedSellers();
      }
      fetchSellers();
    } else {
      alert("No selected seller found!!")
    }
  }

  const viewActiveSellers = async () => {
    try {
      const activeSellers = await getActiveSellers();
      console.log("get all active sellers");
      setSellerList(activeSellers);
      setActiveSellers(true);
      setSuspendedSellers(false);
    } catch (error) {
      console.error('Error fetching suspended sellers:', error);
    }
  };


  const viewSuspendedSellers = async () => {
    try {
      const suspendedSellers = await getSuspendedSellers();
      setSellerList(suspendedSellers);
      setActiveSellers(false);
      setSuspendedSellers(true);
    } catch (error) {
      console.error('Error fetching suspended sellers:', error);
    }
  };

  const openSellerDetailsModal = (seller: SellerInfo) => {
    setSelectedSellerDetails(seller);
    setSellerDetailsModalOpen(true);
  };

  const closeSellerDetailsModal = () => {
    setSelectedSellerDetails(null);
    setSellerDetailsModalOpen(false);
  };
  return (
    <div className="seller-details">
      <div className="container">
        <div className="row sub-headings">
          <div
            className={`col  ${activeSellers ? "active-button" : ""}`}
            onClick={() => viewActiveSellers()}
          >
            Active Sellers
          </div>

          <div
            className={`col  ${suspendedStores ? "active-button" : ""}`}
            onClick={() => viewSuspendedSellers()}
          >
            Suspended sellers
          </div>
        </div>

        {sellerList ? (
          <table className="table table-hover seller-data-table">
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
                <tr key={seller.sellerId}>
                  <td className="col-md-1">{index + 1}</td>
                  <td className="col-md-4">{seller.username}</td>
                  <td className="col-md-3">{seller.email}</td>
                  <td className="col-md-2">{seller.profileStatus}</td>
                   
                  <td className="col-md-2">


                    <button
                      className="btn btn-primary suspend-btn"
                      onClick={() => openSellerDetailsModal(seller)}
                    >
                      View info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Data Available</p>
        )}

        <Modal
          show={sellerDetailsModalOpen}
          onHide={closeSellerDetailsModal}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>Seller Details</Modal.Header>
          <Modal.Body>
            {selectedSellerDetails && (
              <>
                <p><strong>Seller Name:</strong> {selectedSellerDetails.username}</p>
                <p><strong>Email:</strong> {selectedSellerDetails.email}</p>
                <p><strong>Profile Status:</strong> {selectedSellerDetails.profileStatus}</p>
                <p><strong>Gender:</strong> {selectedSellerDetails.gender}</p>
                <p><strong>Date Of Birth:</strong> {selectedSellerDetails.dob}</p>
                <p><strong>Reason:</strong> {selectedSellerDetails.reason}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSellerDetailsModal}>
              Close
            </Button>

            <Button variant={selectedSellerDetails && selectedSellerDetails.profileStatus == 'ACTIVE' ? 'danger' : 'success'} onClick={handleOpenSuspendModal}>
              {selectedSellerDetails && selectedSellerDetails.profileStatus == 'ACTIVE' ? 'SUSPEND' : 'Activate' || 'Undefined!'}
            </Button>


          </Modal.Footer>
        </Modal>


        {/* //2nd modal */}

        <Modal
          show={suspendModalOpen}
          onHide={handleCloseSuspendModal}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>
            {selectedSellerDetails && selectedSellerDetails.profileStatus === 'ACTIVE' ? 'Suspend Seller' : 'Activate Seller'}
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="suspendReason">
              <Form.Label>
                {selectedSellerDetails && selectedSellerDetails.profileStatus === 'ACTIVE' ? 'Reason for Suspension:' : 'Reason for Activation:'}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={selectedSellerDetails && selectedSellerDetails.profileStatus === 'ACTIVE' ? 'Enter reason for suspension' : 'Enter reason for activation'}
                value={suspendReason}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSuspendReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            
          {selectedSellerDetails?.profileStatus === "ACTIVE" ? (
            <Button variant="secondary" onClick={handleCloseSuspendModal}>
              Close
            </Button>
          ):(
            <Button variant="secondary" onClick={handleCloseActiveModal}>
              Close
            </Button>
          )}

            {selectedSellerDetails?.profileStatus === "ACTIVE" ? (
              <Button variant="danger" onClick={handleAction}>
                Confirm suspend
              </Button>
            ) : (
              <Button variant="success" onClick={handleAction}>
                Confirm Active
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default SellerManagement;
function fetchSuspendedSellers() {
  throw new Error("Function not implemented.");
}

