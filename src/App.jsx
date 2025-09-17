import { useEffect, useState } from "react";
import SignUpPage from "./pages/SignUp.jsx";
import LoginPage from "./pages/Login.jsx";
import TimeTrial from "./pages/TimeTrial.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

import AuthLayout from "./layouts/AuthLayout.jsx";
import GameLayout from "./layouts/GameLayout.jsx";

import { Routes, Route } from "react-router-dom";
import Table from "./pages/Table.jsx";
import Game from "./pages/Game.jsx";
import Difficulty from "./pages/Difficulty.jsx";
import Survival from "./pages/Survival.jsx";
import Medium from "./pages/Medium.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<GameLayout />}>
          {/* Protected main game */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />

<<<<<<< HEAD
          <Route
            path="/difficulty"
            element={
              <ProtectedRoute>
                <Difficulty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timetrial"
            element={
              <ProtectedRoute>
                <TimeTrial />
              </ProtectedRoute>
            }
          />

          <Route
            path="/endless"
            element={
              <ProtectedRoute>
                <Survival />
              </ProtectedRoute>
            }
          />

          <Route
            path="/medium"
            element={
              <ProtectedRoute>
                <Medium />
              </ProtectedRoute>
            }
          />

          <Route
            path="/table"
            element={
              <ProtectedRoute>
                <Table />
              </ProtectedRoute>
            }
          />
=======
        <Route element={<AuthLayout />}>
        {/*dito mo lagay lahat ng gusto mo itest */}
        {/*gawa ka route tas ilagay mo sa element yung component na ittetest mo */}
          <Route path="/test" element = {<Game />}/>
          
>>>>>>> 5cfc89a0cf4c692e03aabf102afc439f2d1ad997
        </Route>
      </Routes>

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/test" element={<Game />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
