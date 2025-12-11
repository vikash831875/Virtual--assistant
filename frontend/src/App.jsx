import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import Home from './pages/Home';
import Chat from './pages/Chat';   // ✅ ADD CHAT PAGE
import { userDataContext } from './context/userContext';

function App() {
  const { userData } = useContext(userDataContext);

  const isCustomized =
    userData?.assistantImage && userData?.assistantName;

  return (
    <>
      <Routes>

        {/* HOME ROUTE */}
        <Route
          path="/"
          element={
            isCustomized ? <Home /> : <Navigate to="/customize" />
          }
        />

        {/* SIGN UP */}
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        {/* SIGN IN */}
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />

        {/* CUSTOMIZE STEP 1 */}
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signin" />}
        />

        {/* CUSTOMIZE STEP 2 */}
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signin" />}
        />

        {/* CHAT PAGE (NEW) */}
        <Route
          path="/chat"
          element={isCustomized ? <Chat /> : <Navigate to="/customize" />}
        />

      </Routes>
    </>
  );
}

export default App;
