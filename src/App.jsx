import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import SignUpPage from "./pages/SignUp.jsx";
import LoginPage from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import GameLayout from "./layouts/GameLayout.jsx";

import Table from "./pages/Table.jsx";
import Game from "./pages/Game.jsx";
import Difficulty from "./pages/Difficulty.jsx";
import Modesurvival from "./pages/Modesurvival.jsx";
import TimeTrial from "./pages/TimeTrial.jsx";
import Survival from "./pages/Survival.jsx";
import Medium from "./pages/Medium.jsx";
import Hard from "./pages/TimeTrialH.jsx";
import SurvivalH from "./pages/SurvivalH.jsx";
import Nonmetals from "./pages/Rnon_metals.jsx";
import Metalloids from "./pages/Metalloids.jsx";
import Metals from "./pages/Metals.jsx";
import Noblegases from "./pages/Noblegases.jsx";
import Classic from "./pages/Classic.jsx";
import VerifyEmail from "./pages/VerifyEmail";
import Leaderboard from "./pages/Leaderboard.jsx";
import BackgroundVideo from "./components/BackgroundVideo.jsx"; // ✅ Add this import
import Lobby from "./pages/CompetitiveLobby.jsx";
import Competitive from "./pages/Competitive.jsx";

function App() {
  return (
    <>
      {/* === Global background video that stays across all routes === */}
      <BackgroundVideo />

      {/* === All your routes stay exactly as you had them === */}
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
              path="/modesurvival"
              element={
                <ProtectedRoute>
                  <Modesurvival />
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
              path="/hard"
              element={
                <ProtectedRoute>
                  <Hard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shard"
              element={
                <ProtectedRoute>
                  <SurvivalH />
                </ProtectedRoute>
              }
            />

            <Route
              path="/nonmetals"
              element={
                <ProtectedRoute>
                  <Nonmetals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/metalloids"
              element={
                <ProtectedRoute>
                  <Metalloids />
                </ProtectedRoute>
              }
            />

            <Route
              path="/metals"
              element={
                <ProtectedRoute>
                  <Metals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/noblegas"
              element={
                <ProtectedRoute>
                  <Noblegases />
                </ProtectedRoute>
              }
            />

            <Route
              path="/classic"
              element={
                <ProtectedRoute>
                  <Classic />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
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

            <Route
              path="/room"
              element={
                <ProtectedRoute>
                  <Competitive></Competitive>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route element={<AuthLayout />}>
            {/* test routes */}
            <Route path="/test" element={<Game />} />
          </Route>
        </Routes>

        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/test" element={<Game />} />
          </Route>
        </Routes>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;