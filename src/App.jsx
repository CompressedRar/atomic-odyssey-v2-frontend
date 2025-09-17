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
