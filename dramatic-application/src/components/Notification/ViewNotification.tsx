import React, { useState, useEffect } from 'react';
import './ViewNotification.scss';
import { getAllNotificationsBySellerEmail } from '../../services/apiService';
import { Modal, Button } from 'react-bootstrap';
 
 
interface Notification {
  id: string;
  message: string;
  creationTime: string;
  notificationStatus: string;
}
 
const ViewNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
 
  useEffect(() => {
    const fetchNotifications = async () => {
      const decodedToken = JSON.parse(sessionStorage.getItem('decodedToken') || '{}');
      if (decodedToken && decodedToken.role === 'seller') {
        try {
          const notifications = await getAllNotificationsBySellerEmail(decodedToken.email);
          setNotifications(notifications);
        } catch (error) {
         
        }
      }
    };
 
    fetchNotifications();
  }, []);
  const openNotificationModal = (notification: Notification) => {
    setSelectedNotification(notification);
  };
 
  const handleCloseNotificationModal = () => {
    setSelectedNotification(null);
  };
 
  return (
    <div className="product-details">
      <div className="container">
        {notifications.length > 0 ? (
          <table className="table table-hover product-data-table">
            <thead>
              <tr>
                <th className="col-md-1">#</th>
                <th className="col-md-7">Message</th>
                <th className="col-md-2">Creation Time</th>
                <th className="col-md-2">Status</th>
                <th className="col-md-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification: Notification, index: number) => (
                <tr key={notification.id}>
                  <td className="col-md-1">{index + 1}</td>
                  <td className="col-md-7">{notification.message}</td>
                  <td className="col-md-2">{notification.creationTime}</td>
                  <td className="col-md-2">{notification.notificationStatus}</td>
                  <td className="col-md-1 text-center">
                    <button
                      className="btn btn-primary view-info-btn"
                      onClick={() => openNotificationModal(notification)}
                    >
                      View Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No notifications available.</p>
        )}
 
        {selectedNotification && (
          <Modal
            show={!!selectedNotification}
            onHide={handleCloseNotificationModal}
            backdrop="static"
            keyboard={false}
            size="sm"
            centered
          >
            <Modal.Header closeButton>Notification Information </Modal.Header>
            <Modal.Body>
              <p><b>Message:</b> {selectedNotification.message}</p>
              <p><b>Creation Time:</b> {selectedNotification.creationTime}</p>
              <p><b>Notification Status:</b> {selectedNotification.notificationStatus}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="form-submit-btn"
                variant="secondary"
                onClick={handleCloseNotificationModal}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};
 
export default ViewNotifications;