import { toast } from "react-toastify";
import { getAllNotificationsBySellerEmail } from "../../services/apiService";

const handleAlert = async () => {
    const emailx = sessionStorage.getItem("email");
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const fetchNotifications = async () => {
        try {
            if (emailx) {
                const notifications = await getAllNotificationsBySellerEmail(emailx);
                const openNotificationsCount = notifications.filter((notification: { notificationStatus: string; }) => notification.notificationStatus === 'OPEN').length;
                toast.warning(`You have ${openNotificationsCount} open notifications.`);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const checkAndSetInterval = () => {
        if (window.location.pathname !== '/notifications') {
            clearInterval(intervalId);
            intervalId = setInterval(fetchNotifications, 30000);
        } else {
            clearInterval(intervalId);
        }
    };

    // Initially set the interval based on the current window location
    checkAndSetInterval();

    // Check window location every 5 seconds and adjust the interval accordingly
    let running = true;
    while (running) {
        setTimeout(() => {
            if (window.location.pathname === '/notifications') {
                clearInterval(intervalId);
                running = false;
            } else {
                checkAndSetInterval();
            }
        }, 30000);
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds before re-checking
    }

    // Clear interval when navigating to '/notifications'
    window.addEventListener('hashchange', () => {
        if (window.location.pathname === '/notifications') {
            clearInterval(intervalId);
        } else {
            checkAndSetInterval();
        }
    });
};

export default handleAlert;

