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
        <Container style={{minHeight: "100vh", minWidth: "100%", padding:"0"}}>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    exact
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/complete_profile"
                    element={
                      <PrivateRoute>
                        <CompleteProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </AuthProvider>  
            </Router>
        </Container>
  );
}

export default App;
