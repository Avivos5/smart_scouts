import React from 'react'
import {Button, Navbar, Container, Nav} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'


export default function UserPageTemplate({ children }) {

  const {logout} = useAuth();
  const navigate = useNavigate();

  async function handeLogout (){
    try{
      await logout(logout)
      navigate("/login")
    }catch{
    }
  }

  return (
    <Container style={{minWidth: "100vw", padding:"0"}}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home">SmartScouts</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>
          <Nav style={{gap: '5px'}}>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Button onClick={handeLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
        <Container>
          {children}
        </Container>
    </Container>
  )
}
