// OrderProduct.tsx
import React from 'react';
import './OrderProduct.scss';

interface OrderPageProps {
  productId: string;
  // other props that OrderPage might expect
}

const OrderPage: React.FC<OrderPageProps> = ({ productId }) => {
  // Render OrderPage component with productId

  return (
    <div className='place-order-container container'>

      <div className="place-order-page row">
        <div className="place-order-details col-md-5">

          <h1>Order Summery</h1>

          <div> {productId}</div>

        </div>

      </div>

    </div>

  );
};

export default OrderPage;
