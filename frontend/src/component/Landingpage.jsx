import React from 'react'
import Productlist from './product/Productlist'
import HorizontalProductList from './HorizontalScrollProducts/HorizontalScrollProducts'
// import Handmadeproduct from './Handmadeproduct/Handmadeproduct'
// import UserExample from './User/UserExample'
// import RewardsList from './Rewardcard/RewardsList'
import PromotionCarousel from './PromotionCarousel/PromotionCarousel'
import Home from './Home/Home'
import Header from './Header/Header'
import Footer from './footer/Footer'
import ProAccount from './Shope/userprofilepage/ProAccount'
import SellSocialMediaAccount from './Shope/userprofilepage/SellSocialMediaAccount'
import OrdersDashboard from './Shope/userprofilepage/OrdersDashboard'
import ServicesSection from './ServicesSection/ServicesSection'
import DigitalProductsList from './DigitalProductsList'
import AdminDashboard from '../Admin/AdminDashboard'
import AdminKYCList from '../Admin/AdminUsersTable/AdminKYCList'
import AdminProfileList from '../Admin/AdminUsersTable/AdminProfileList'
import OurCustomers from './User/OurCustomers '
import StepsAnimated from './StepsAnimated/StepsAnimated'
 import Userprofile from '../component/User/Userprofile'
import Giftproducts from './giftproduct/Giftproducts'
import BookMarketplace from './BookMarketplace'
import BuyerProducts from '../nearproducts/BuyerProducts'
import HowPlatformWorks from '../nearproducts/HowPlatformWorks'
import PhysicalProductsHome from './PhysicalProducts/PhysicalProductsHome'

function Landingpage() {
  return (
    <div>
      
      <Header />
        <Home/>

        {/* https://themewagon.com/themes/furni-online-store/ */}
                    
                    <HorizontalProductList/>
                    <Productlist/>
                    <Giftproducts/>
                    <BookMarketplace/>
                    <PhysicalProductsHome/>
                    {/* <RewardsList/> */}
                    {/* <Handmadeproduct/> */}

                    <HowPlatformWorks/>
                    
                    {/* <RewardsList/> */}
                    {/* <StepsAnimated/> */}
                    <BuyerProducts/>
              
                    <PromotionCarousel/>
                    <Userprofile/>
                    <ProAccount/>
                    <ServicesSection/>

                     <Footer />
                     {/* <SellSocialMediaAccount/>
                     <OrdersDashboard/> */}
                     {/* <DigitalProductsList/> */}

                     {/* <AdminDashboard/> */}
                     {/* <AdminKYCList/> */}
                     {/* <AdminProfileList/>
                     <OurCustomers/>
       */}
    </div>
  ) 
}

export default Landingpage
