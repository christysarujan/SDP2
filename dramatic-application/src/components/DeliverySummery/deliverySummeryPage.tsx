import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './DeliverySummaryPage.scss';

interface OrderItem {
    image: string;
    productName: string;
    productPrice: number;
    color: string;
    size: string;
    quantity: number;
    deliveryCharge: number;
    newFinalTotal: number;
    orderId: string;
}

const DeliverySummaryPage: React.FC = () => {
    const location = useLocation();
    const orderDetailsArray: OrderItem[] | undefined = location.state?.orderDetailsArray;
    const paymentId: string | undefined = location.state?.message;

    let totalNewFinalTotal: number = 0;

    if (orderDetailsArray) {
        totalNewFinalTotal = orderDetailsArray.reduce((total, item) => total + item.newFinalTotal, 0);
    }

    const contentRef = useRef<HTMLDivElement>(null);

    const saveAsPDF = () => {
        if (contentRef.current) {
            const htmlContent = contentRef.current.outerHTML;

            // Create a new window to render HTML content
            const newWindow = window.open('', '_blank');

            if (newWindow) {
                // Exclude elements you want to remove from the printed document
                const clonedContent = contentRef.current.cloneNode(true) as HTMLDivElement;
                const elementsToRemove = clonedContent.querySelectorAll('.exclude-from-print');
                elementsToRemove.forEach(element => {
                    element.parentNode?.removeChild(element);
                });

                newWindow.document.body.innerHTML = clonedContent.outerHTML;

                // Wait for content to be rendered before printing
                setTimeout(() => {
                    newWindow.document.title = 'Delivery Summary';
                    newWindow.print();
                }, 1000); // Adjust delay as needed
            }
        }
    };

    return (
        <div className="delivery-summary-container" ref={contentRef}>
            <h2>Delivery Summary</h2>
            {orderDetailsArray ? (
                <>
                    <ul className="order-list">
                        {orderDetailsArray.map((orderItem, index) => (
                            <React.Fragment key={index}>
                                <li className="order-item">
                                    <img src={orderItem.image} alt={orderItem.productName} style={{ width: '200px', height: '250px' }} />
                                    <div className="order-details">
                                        <h3>{orderItem.productName}</h3>
                                        <p>Price: {orderItem.productPrice}</p>
                                        <p>Color: {orderItem.color}</p>
                                        <p>Size: {orderItem.size}</p>
                                        <p>Quantity: {orderItem.quantity}</p>
                                        <p>Delivery Charge: {orderItem.deliveryCharge}</p>
                                        <p>Total: {orderItem.newFinalTotal}</p>
                                        <p>Order Id: {orderItem.orderId}</p>
                                        <span className="paid-icon">PAID</span>
                                    </div>
                                </li>
                                {index < orderDetailsArray.length - 1 && <hr className="print-only" />} {/* Add horizontal line if not the last item */}
                            </React.Fragment>
                        ))}
                    </ul>
                    <div className="total-summary">
                        <p><strong>Total Paid: {totalNewFinalTotal} </strong></p>
                    </div>
                    <div className="payment-id">
                        <p><strong>Payment Id: {paymentId} </strong></p>
                    </div>
                    <button onClick={saveAsPDF}>Print</button>
                </>
            ) : (
                <p>No order details found</p>
            )}
        </div>
    );
}

export default DeliverySummaryPage;
