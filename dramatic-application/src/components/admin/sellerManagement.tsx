import React, { ChangeEvent, useEffect, useState } from "react";
import "./sellerManagement.scss";
import { getAllSellers,activateSellerByEmail,suspendSellerByEmail, getSuspendedSellers, getActiveSellers  } from "../../services/apiService";
import { Modal, Button, Form } from "react-bootstrap";

interface SellerInfo {
  sellerId: string
  username: string;
  email: string;
  profileStatus: string;
  id : any ;
}

const SellerManagement = () => {
  const [activeSellers, setActiveSellers] = useState(true);
  const [suspendedStores, setSuspendedSellers] = useState(true);
  const [sellerList, setSellerList] = useState<SellerInfo[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<SellerInfo | null>(null);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [reason, setreason, ] = useState('');

  useEffect(() => {
    viewActiveSellers();
    //fetchSellers();
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
  };

  const handleSuspend = async () => {
    
    if (selectedSeller && suspendReason) {
      try {
        console.log("I m inside handle suspend ",selectedSeller.id)
    
        await suspendSellerByEmail(selectedSeller.id, suspendReason);
      } catch (error) {
        console.error("Error suspending seller:", error);
      }
    }
  };

  const handleActivate = async () => {
    if (selectedSeller) {
      try {
        await activateSellerByEmail(selectedSeller.id,"reason");
        fetchSellers();
      } catch (error) {
        console.error("Error activating seller:", error);
      }
    }
  };

  const viewActiveSellers = async () => {
    try {
      const activeSellers = await getActiveSellers(); 
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
                      onClick={() => openSuspendModal(seller)}
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
          show={suspendModalOpen}
          onHide={handleCloseSuspendModal}
          backdrop="static"
          keyboard={false}
          size="sm"
          centered
        >
          <Modal.Header closeButton>Seller Account Status</Modal.Header>
          <Modal.Body>
          {selectedSeller && selectedSeller.profileStatus === 'SUSPEND' ? (
              <Form.Group controlId="suspendReason">
                <Form.Label>Activate Reason:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter reason for activation"
                  value={suspendReason}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSuspendReason(e.target.value)}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="suspendReason">
                <Form.Label>Suspend Reason:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter reason for suspension"
                  value={suspendReason}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSuspendReason(e.target.value)}
                />
              </Form.Group>
            )}
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuspendModal}>
              Close
            </Button>
            {suspendedStores && selectedSeller?.profileStatus === 'SUSPEND' && (
                      <Button
                        variant="success"
                        onClick = {handleActivate}
                      >
                        Activate
                      </Button>
                    )}
            {activeSellers && selectedSeller?.profileStatus === 'ACTIVE' && (
                      <Button
                        variant="danger"
                        onClick = {handleSuspend}
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
function fetchSuspendedSellers() {
  throw new Error("Function not implemented.");
}

