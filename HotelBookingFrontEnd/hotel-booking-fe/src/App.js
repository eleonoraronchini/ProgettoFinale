import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNavbar from "./component/common/MyNavbar";
import MyFooter from "./component/common/MyFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import HomePage from "./component/home/HomePage";
import AllRoomsPage from "./component/booking_rooms/AllRoomsPage";


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <MyNavbar/>
      <div className="content">
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route exact path="/home" element={<HomePage/>}/>
          <Route path="/rooms" element={<AllRoomsPage/>}/>

        </Routes>

      </div>
      <MyFooter/>
       </div>
    </BrowserRouter>
    
  );
}

export default App;
