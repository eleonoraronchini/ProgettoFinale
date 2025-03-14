import { BrowserRouter, Routes } from "react-router-dom";
import MyNavbar from "./component/common/MyNavbar";
import MyFooter from "./component/common/MyFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <MyNavbar/>
      <div className="content">
        <Routes>

        </Routes>

      </div>
      <MyFooter/>
       </div>
    </BrowserRouter>
    
  );
}

export default App;
