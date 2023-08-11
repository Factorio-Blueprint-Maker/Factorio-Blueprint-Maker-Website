import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import BlueprintDetail from './Components/BlueprintDetail.js';
import Content from './Components/Content.js';
import Header from './Components/Header.js'; 
import Signin from './Components/Signin.js';
import Signup from './Components/Signup.js';
import Account from './Components/Account.js';
import ProtectedRoutes from './Components/ProtectedRoutes.js';

import { AuthProvider } from './Context/authContext.js';


function App() {
  return (
    <div> 
      <AuthProvider>
        <Header />

        <Router>
          <Routes>
            <Route path="/explore" element={<Content />} />
            <Route path="/explore/blueprint/:blueprintId" element={<BlueprintDetail />} />
            <Route path="/signin" element={<Signin />} />            
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<ProtectedRoutes><Account /></ProtectedRoutes>} />
            <Route path="*" element={<Navigate to="/explore" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;