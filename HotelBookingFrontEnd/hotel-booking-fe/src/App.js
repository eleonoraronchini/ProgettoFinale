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
import { CustomerRoute } from "./service/Guard";
import FindBookingPage from "./component/booking_rooms/FindBookingPage";
import ProfilePage from "./component/profile/ProfilePage";
import EditProfile from "./component/profile/EditProfile";



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
          <Route path="/edit-profile"element= {<CustomerRoute element={<EditProfile/>}/>}/>
         
        </Routes>

      </div>
      <MyFooter/>
       </div>
    </BrowserRouter>
    
  );
}

export default App;
