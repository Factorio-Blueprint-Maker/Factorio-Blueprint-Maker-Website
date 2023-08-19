import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import "./Styles/Globals.scss";

// Components
import BlueprintDetail from './Components/BlueprintDetail.js';
import Content from './Pages/Explorer/BlueprintExplorer.js';
import Header from './Components/Header.js'; 
import Signin from './Pages/Authentication/Signin.js';
import Signup from './Pages/Authentication/Signup.js';
import MyFavoriteBlueprints from './Pages/MyFavorites/MyFavoriteBlueprints';
import VerifyEmail from './Pages/Authentication/VerifyEmail';
import ExploreUserBlueprint from './Components/ExploreUserBlueprint';

import { AuthProvider } from './Context/authContext.js';
import { BlueprintProvider  } from './Context/blueprintContext';

// Routes
import AuthRoute from './Components/AuthRoute';
import ProtectedRoutes from './Components/ProtectedRoutes.js';
import VerificationRoute from './Components/VerificationRoute';

const Account = lazy(() => import("./Components/Account.js"))
const MyBlueprints = lazy(() => import("./Pages/MyBlueprints/MyBlueprints.js"))
const AboutApp = lazy(() => import("./Pages/AboutApp/AboutApp"))

function App() {
  return (
    <div> 
      
      <AuthProvider>
        <BlueprintProvider>
        <Router>
        <Header />

          <Routes>

            {/* Public Routes */}
            <Route path="explore" element={<Content />} />
            <Route path="about-app" element={<Suspense fallback={<div>Loading...</div>}><AboutApp/></Suspense>}/>
            <Route path="explore/blueprint/:blueprintId" element={<BlueprintDetail />} />
            <Route path="explore/:userId" element={<ExploreUserBlueprint/>} />

            {/* Verification Route */}
            <Route path="verify-email" element={<VerificationRoute><VerifyEmail/></VerificationRoute>}/>

            {/* Authentication Routes */}
            <Route path="signin" element={<AuthRoute><Signin /></AuthRoute>} />            
            <Route path="signup" element={<AuthRoute><Signup /></AuthRoute>} />

            {/* Protected Routes */}
            <Route path="account" element={<Suspense fallback={<div>Loading...</div>}><ProtectedRoutes><Account /></ProtectedRoutes></Suspense>} />
                         
            <Route path="my-blueprints" element={<Suspense fallback={<div>Loading...</div>}><ProtectedRoutes><MyBlueprints /></ProtectedRoutes></Suspense>} />
            <Route path="my-favorites" element={<ProtectedRoutes><MyFavoriteBlueprints/></ProtectedRoutes>} />


            <Route path="*" element={<Navigate to="signin" />} />

          </Routes>
        </Router>
        </BlueprintProvider>
      </AuthProvider>
    </div>
  );
}

export default App;