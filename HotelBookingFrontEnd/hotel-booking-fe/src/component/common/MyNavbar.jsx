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
            {!isAuthenticated && <Nav.Link as={NavLink} to="/login" end>Login</Nav.Link>}
            {!isAuthenticated && <Nav.Link as={NavLink} to="/register" end>Register</Nav.Link>}
            {isAuthenticated && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;