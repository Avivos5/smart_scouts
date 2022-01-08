import React from 'react'
import {Button} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'

export default function Dashboard() {

  const {currentUser} = useAuth();
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
    <div>
        <h1>Dashboard</h1>
        <p>Current user: {currentUser.email}</p>
        <Button onClick={handeLogout}>Logout</Button>
    </div>
  )
}
