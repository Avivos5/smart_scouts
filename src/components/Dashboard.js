import React from 'react'
import {useAuth} from '../contexts/AuthContext'
import UserPageTemplate from '../templates/UserPageTemplate';

export default function Dashboard() {

  const {currentUser} = useAuth();

  return (
    <UserPageTemplate>
        <h1>Dashboard</h1>
        <p>Current user: {currentUser.email}</p>
    </UserPageTemplate>
  )
}
