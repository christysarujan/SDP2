import { getAllNotificationsBySellerEmail } from "../../services/apiService";

async function GetOpenNotificationCount() {
  const emailx = sessionStorage.getItem("email");
  try {
    if (emailx) {
        const notifications = await getAllNotificationsBySellerEmail(emailx);
        const openNotificationsCount = notifications.filter((notification: { notificationStatus: string; }) => notification.notificationStatus === 'OPEN').length;
        return openNotificationsCount;
        // toast.warning(`You have ${openNotificationsCount} open notifications.`);
    }
} catch (error) {
    console.error('Error fetching notifications:', error);
}
  }

  export default GetOpenNotificationCount;
