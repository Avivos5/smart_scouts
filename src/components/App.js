import React from 'react';
import { Container } from 'react-bootstrap';
import AuthProvider from '../contexts/AuthContext';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import CompleteProfile from './CompleteProfile';
import Profile from './Profile';

function App() {
  return (
        <Container className='d-flex align-items-center justify-content-center'
        style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: '400px'}}>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* te dwie ścieżki ponieżej do private route? */}
                  <Route path="/complete_profile" element={<CompleteProfile />} /> 
                  <Route path="/profile" element={<Profile/>} />
                </Routes>
              </AuthProvider>  
            </Router>
          </div>
        </Container>
  );
}

export default App;
