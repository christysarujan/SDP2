import React, { useEffect } from 'react';
import './App.scss';
import LandingPage from './components/LandingPage/LandingPage';
import AuthForm from './components/AuthForm/AuthForm';
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import UserProfile from './components/UserProfile/UserProfile';
import UserProfileEdit from './components/UserProfile/UserProfileEdit/UserProfileEdit';
import Store from './components/Store/Store';
import SellerProductList from './components/SellerProductList/SellerProductList';
import SellerPaymentDetails from './components/SellerPaymentDetails/SellerPaymentDetails';
import UserAddressManagement from './components/UserAddressManagement/UserAddressManagament';
import SellerProductEdit from './components/SellerProductList/SellerProductEdit/SellerProductEdit';
import StoreRequests from './components/admin/storeRequests';
import Inventory from './components/Inventory/Inventory';
import SellerManagement from './components/admin/sellerManagement';
import MenItemsListPage from './components/ProductsList/Men/MenItemsListPage';
import WomenItemsListPage from './components/ProductsList/Women/WomenItemsListPage';
import KidsItemsListPage from './components/ProductsList/Kid/KidsItemsListPage';
import ProductPageRoute from './components/ProductsList/ViewProduct/productPageRoute';
import ViewCartPage from './components/Cart/ViewCart';
import { CartProvider } from './components/Cart/CartContext'; // Import CartProvider from CartContext
import ProductManagement from './components/admin/productManagement';
import ViewWishPage from './components/WishList/WishList';
import ViewNotifications from './components/Notification/ViewNotification';
import OrderPageRoute from './components/OrderProduct/orderPageRoute';
import OrderDetailsCart from './components/OrderProduct/orderDetailsCart';
import SearchResults from './components/SearchResults/Search';

// Import ViewNotifications component
import { useLocation , useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import { getAllNotificationsBySellerEmail } from './services/apiService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/search/:name',
        element: <SearchResults />,
        
      },
      {
        path: '/auth',
        element: <AuthForm />
      },
      {
        path: '/verifyEmail',
        element: <VerifyEmail />,
      },
      {
        path: '/viewCart',
        element: <ViewCartPage />,
      },
      {
        path: '/viewproduct/:productId',
        element: <ProductPageRoute />
      },
      {
        path: '/orderproduct/:productId',
        element: <OrderPageRoute />
      },
      {
        path: '/mensItems',
        element: <MenItemsListPage />,
      },
      {
        path: '/womenItems',
        element: <WomenItemsListPage />,
      },
      {
        path: '/kidsItems',
        element: <KidsItemsListPage />,
      },
      {
        path: '/viewWish',
        element: <ViewWishPage />,
      },
      {
        path: '/orderDetailsCart',
        element: <OrderDetailsCart />,
      },
      {
        path: '/notifications',
        element: <ViewNotifications />,
      },
      
      {
        path: '/',
        element: <UserProfile />,
        children: [
          {
            path: 'store',
            element: <Store />
          },
          {
            path: 'product',
            element: <SellerProductList />,
            children: [
              {
                path: 'productEdit',
                element: <SellerProductEdit productId="" onClose={() => console.log("Close function")}/>
              }
            ]
          },
          {
            path: 'paymentInfo',
            element: <SellerPaymentDetails />
          },
          {
            path: 'addressManagement',
            element: <UserAddressManagement />
          },
          {
            path:'userProfileEdit',
            element: <UserProfileEdit />,
          },
          {
            path:'storeInfo',
            element: <StoreRequests />,
          },
          {
            path:'inventory',
            element: <Inventory productId=""  onClose={() => console.log("Close function")}/>,
          },
          {
            path:'sellerManagement',
            element: <SellerManagement />,
          },
          {
            path:'productManagement',
            element: <ProductManagement/>,
          },
        ]

      },
      
    ]
  }
]);

function App() {
  
  return (
    <div className="app-main">
      <CartProvider> 
        <RouterProvider router={router} />
      </CartProvider>
    </div>
  );
}

export default App;
