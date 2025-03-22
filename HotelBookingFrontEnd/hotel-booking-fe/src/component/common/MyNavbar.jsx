import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function MyNavbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isCustomer = ApiService.isCustomer();
  const isAdmin = ApiService.isAdmin();

  const navigate = useNavigate();

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      ApiService.logout();
      navigate("/home");
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary my-navbar">
      <Container>
        <img src="../../../images/puni.png" alt="logo" className="pe-2" style={{ width: "50px" }} />
        <Navbar.Brand as={NavLink} to="/home">PunPun Lodge</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/rooms" end>Rooms</Nav.Link>
            {isCustomer && <Nav.Link as={NavLink} to="/find-booking" end>Find My Bookings</Nav.Link>}
            {isCustomer && <Nav.Link as={NavLink} to="/profile" end>Profile</Nav.Link>}
            {isAdmin && <Nav.Link as={NavLink} to="/admin" end>Admin</Nav.Link>}
          </Nav>
          <Nav>
            {!isAuthenticated && (
              <div className="d-flex align-items-center">
  
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="dark"
                  className="bi bi-door-open me-1 d-none d-lg-flex"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1" />
                  <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z" />
                </svg>
                <Nav.Link as={NavLink} to="/login" end>Login</Nav.Link>
              </div>
            )}
            {!isAuthenticated && <Nav.Link as={NavLink} to="/register" end>Register</Nav.Link>}
            {isAuthenticated && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;