import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




import { AuthProvider } from './Context/Authcontext';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import RequireKycAndProfile from './ProtectedRoute/RequireKycAndProfile';

import Landingpage from './component/Landingpage';
import Register from './pages/Register';
import Login from './pages/Login';
import BrowseAllProducts from './component/BrowseAllProducts/BrowseAllProducts';
import UserProfileFormFixed from './kyc/UserProfileFormFixed';
import DashboardLayout from './kyc/DashboardLayout';
import SellerPage from './Account/SellerPage';
import OrdersDashboard from './component/Shope/userprofilepage/OrdersDashboard';
import ListingsDashboard from './component/Shope/userprofilepage/ListingsDashboard';
import AffiliateOrders from './component/Shope/userprofilepage/AffiliateOrders';
import AddDigitalProduct from './component/Shope/userprofilepage/AddDigitalProduct';
import ADDphysicalproducts from './component/Shope/userprofilepage/ADDphysicalproducts';

import AddBook from './component/Shope/userprofilepage/AddBook';
import SellSocialMediaAccount from './component/Shope/userprofilepage/SellSocialMediaAccount';
import FullMultiStepKYC from './kyc/FullMultiStepKYC';
import Claims from './component/Shope/userprofilepage/Claims';
import AdminUsersTable from './Admin/AdminUsersTable/AdminUsersTable';
import AdminDashboard from './Admin/AdminDashboard';
import AdminKYCList from './Admin/AdminUsersTable/AdminKYCList';
import AdminProfileList from './Admin/AdminUsersTable/AdminProfileList';
import AdminDigitalProductsTable from './Admin/products/AdminDigitalProductsTable';
import AdminPhysicalproducts from './Admin/products/AdminPhysicalproducts';
import ProductDetails from './ProductDetails/ProductDetails';
import Viewpage from './kyc/Viewpage';
import Settings from './kyc/Settings';
import Bank from './kyc/Bank';
import TelegeramLanding from './telegeram/TelegeramLanding';
import Telegram from './telegeram/Telegram';
import SupportChat from './Ai/SupportChat';
import UserExample from './component/User/UserExample';
import Userprofile from './component/User/Userprofile';
import Addgiftproduct from './component/Shope/userprofilepage/Addgiftproduct';
import Admingiftproduct from './Admin/products/Admingiftproduct';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/TelegeramLanding" element={<TelegeramLanding />} />
          <Route path="/Telegram" element={<Telegram />} />
          <Route path="/SupportChat" element={<SupportChat />} />
          <Route path="/UserExample" element={<UserExample />} />
          <Route path="/Userprofiless" element={<Userprofile />} />
          <ToastContainer position="top-right" autoClose={3000} />
          <Route path="/dashboard" element={<DashboardLayout><h2>Dashboard Home</h2></DashboardLayout>} />
          <Route
            path="/orders"
            element={
              // <ProtectedRoute>
                <RequireKycAndProfile>
                  {/* <ShopPage /> */}
                   <OrdersDashboard />
                </RequireKycAndProfile>
              // </ProtectedRoute>
            }
          />
         <Route path="/ProductDetails/:id" element={
          // <ProtectedRoute>
          <ProductDetails />
          // </ProtectedRoute>
          } />

          {/* admin */}
          <Route path="/AdminUsersTable" element={<AdminUsersTable />} />


          {/* Protected Routes */}
          <Route
            path="/BrowseAllProducts"
            element={
              <ProtectedRoute>
                <BrowseAllProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/userprofile"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <UserProfileFormFixed />
                </DashboardLayout>
              // </ProtectedRoute>
            }   
          />  

           <Route
            path="/Viewpage"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <Viewpage />
                </DashboardLayout>
              // </ProtectedRoute>
            }   
          /> 
          
          <Route
            path="/Settings"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              // </ProtectedRoute>
            }   
          />   
            <Route
            path="/Bank"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <Bank />
                </DashboardLayout>
              // </ProtectedRoute>
            }   
          />

               <Route
            path="/RecognitionForm"
            element={
                  <FullMultiStepKYC />
            }
          />
          {/* Account/Selling Pages */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <SellerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <RequireKycAndProfile>
                  <OrdersDashboard />
                </RequireKycAndProfile>
              </ProtectedRoute>
            }
          />

          <Route
            path="/listings"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <ListingsDashboard />
                </DashboardLayout>
              // </ProtectedRoute>
            }
          />

          <Route
            path="/affiliate"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AffiliateOrders />
                </DashboardLayout>
               </ProtectedRoute>
            }
          />   
            <Route
            path="/claims"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Claims />
                </DashboardLayout>
               </ProtectedRoute>
            }
          /> 

          <Route
            path="/digitalproduct"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <AddDigitalProduct />
                </DashboardLayout>
              // </ProtectedRoute>
            }
          />  
              <Route
            path="/Giftproduct"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <Addgiftproduct />
                </DashboardLayout>
              // </ProtectedRoute>
            }
          />
            <Route
            path="/ADDphysicalproducts"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <ADDphysicalproducts />
                </DashboardLayout>
              // </ProtectedRoute>
            }
          />  
                        <Route
                  path="/AdminKYCList"
                  element={
                    <AdminDashboard>
                      <AdminKYCList />
                    </AdminDashboard>
                  }
                />   
                      <Route
                  path="/AdminProfileList"
                  element={
                    <AdminDashboard>
                      <AdminProfileList />
                    </AdminDashboard>
                  }
                />   
                 <Route
                  path="/AdminUsersTable"
                  element={
                    <AdminDashboard>
                      <AdminUsersTable />
                    </AdminDashboard>
                  }
                />    
                 <Route
                  path="/AdminDigitalProductsTable"
                  element={
                    <AdminDashboard>
                      <AdminDigitalProductsTable />
                    </AdminDashboard>
                  }
                />  
                 <Route
                  path="/AdminPhysicalproducts"
                  element={
                    <AdminDashboard>
                      <AdminPhysicalproducts />
                    </AdminDashboard>
                  }
                />
                 <Route
                  path="/Admingiftproduct"
                  element={
                    <AdminDashboard>
                      <Admingiftproduct />
                    </AdminDashboard>
                  }
                />

          

          <Route
            path="/addbook"
            element={
              // <ProtectedRoute>
                <DashboardLayout>
                  <AddBook />
                </DashboardLayout>
              // </ProtectedRoute>
            }
          />

          <Route
            path="/socialmediaaccount"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SellSocialMediaAccount />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
