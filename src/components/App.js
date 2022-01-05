import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import AuthProvider from '../contexts/AuthContext';
import firebase from '../firebase';
import Signup from './Signup';

function App() {
  return (
    <AuthProvider>
      <div>
        <Container className='d-flex align-items-center justify-content-center'
        style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: '400px'}}>
            <Signup />
          </div>
        </Container>
      </div>
    </AuthProvider>
  );
}

export default App;
