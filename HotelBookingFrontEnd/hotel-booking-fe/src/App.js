import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNavbar from "./component/common/MyNavbar";
import MyFooter from "./component/common/MyFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import HomePage from "./component/home/HomePage";
import AllRoomsPage from "./component/booking_rooms/AllRoomsPage";
import RoomDetailsPage from "./component/booking_rooms/RoomDetailsPage";
import { AdminRoute, CustomerRoute } from "./service/Guard";
import FindBookingPage from "./component/booking_rooms/FindBookingPage";
import ProfilePage from "./component/profile/ProfilePage";
import PaymentFailed from "./component/payment/PaymentFailed";
import PaymentPage from "./component/payment/PaymentPage";
import PaymentSuccess from "./component/payment/PaymentSuccess";
import AdminPage from "./component/admin/AdminPage";
import ManageRoomPage from "./component/admin/ManageRoomPage";
import AddRoomPage from "./component/admin/AddRoomPage";
import EditRoomPage from "./component/admin/EditRoomPage";
import ManageBookingPage from "./component/admin/ManageBookingPage";
import EditBookingPage from "./component/admin/EditBookingPage";
import EditProfilePage from "./component/profile/EditProfilePage";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <MyNavbar/>
      <div className="content">
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route exact path="/home" element={<HomePage/>}/>
          <Route path="/rooms" element={<AllRoomsPage/>}/>
          <Route path="/find-booking" element={<FindBookingPage/>}/>
          <Route path="/room-details/:roomId"element= {<CustomerRoute element={<RoomDetailsPage/>}/>}/>
          <Route path="/profile"element= {<CustomerRoute element={<ProfilePage/>}/>}/>
          <Route path="/edit-profile"element= {<CustomerRoute element={<EditProfilePage/>}/>}/>
          <Route path="/payment/:bookingReference/:amount"element= {<CustomerRoute element={<PaymentPage/>}/>}/>
          <Route path="/payment-success/:bookingReference"element= {<CustomerRoute element={<PaymentSuccess/>}/>}/>
          <Route path="/payment-failed/:bookingReference"element= {<CustomerRoute element={<PaymentFailed/>}/>}/>
          
          <Route path="/admin"element= {<AdminRoute element={<AdminPage/>}/>}/>
          <Route path="/admin/manage-rooms"element= {<AdminRoute element={<ManageRoomPage/>}/>}/>
          <Route path="/admin/add-room"element= {<AdminRoute element={<AddRoomPage/>}/>}/>
          <Route path="/admin/edit-room/:roomId"element= {<AdminRoute element={<EditRoomPage/>}/>}/>
          <Route path="/admin/manage-bookings"element= {<AdminRoute element={<ManageBookingPage/>}/>}/>
          <Route path="/admin/edit-booking/:bookingCode"element= {<AdminRoute element={<EditBookingPage/>}/>}/>

         
        </Routes>

      </div>
      <MyFooter/>
       </div>
    </BrowserRouter>
    
  );
}

export default App;
