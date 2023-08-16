import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import BlueprintDetail from './Components/BlueprintDetail.js';
import Content from './Pages/Explorer/BlueprintExplorer.js';
import Header from './Components/Header.js'; 
import Signin from './Pages/Authentication/Signin.js';
import Signup from './Pages/Authentication/Signup.js';
import Account from './Components/Account.js';
import ProtectedRoutes from './Components/ProtectedRoutes.js';
import MyBlueprints from './Pages/MyBlueprints/MyBlueprints.js'

import { AuthProvider } from './Context/authContext.js';
import { BlueprintProvider  } from './Context/blueprintContext';

function App() {
  return (
    <div> 
      
      <AuthProvider>
        <BlueprintProvider>
        <Header />

        <Router>
          <Routes>
            <Route path="explore" element={<Content />} />
            <Route path="explore/blueprint/:blueprintId" element={<BlueprintDetail />} />
            <Route path="signin" element={<Signin />} />            
            <Route path="signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="account" element={<ProtectedRoutes><Account /></ProtectedRoutes>} />
            <Route path="my-blueprints" element={<ProtectedRoutes><MyBlueprints /></ProtectedRoutes>} />


            <Route path="*" element={<Navigate to="/explore" />} />
          </Routes>
        </Router>
        </BlueprintProvider>
      </AuthProvider>
    </div>
  );
}

export default App;