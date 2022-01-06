import React from 'react';
import { Container } from 'react-bootstrap';
import AuthProvider from '../contexts/AuthContext';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Login from './Login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
        <Container className='d-flex align-items-center justify-content-center'
        style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: '400px'}}>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route exact path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </AuthProvider>  
            </Router>
          </div>
        </Container>
  );
}

export default App;
