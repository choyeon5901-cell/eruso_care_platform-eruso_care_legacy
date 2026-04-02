import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// 기존 페이지들
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindAccount from "./pages/FindAccount";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Orders from "./pages/Orders";
import Prescription from "./pages/Prescription";
import VideoCall from "./pages/VideoCall";
import Video from "./Video";

// 🔥 추가
import UserOrders from "./pages/UserOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 기본 진입 */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 인증 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-account" element={<FindAccount />} />

        {/* 🔥 보호 라우트 적용 */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescription"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />

        {/* 🔥 여기로 이동 + 보호 적용 */}
        <Route
          path="/user-orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/video" 
          element={
            <VideoCall />
          }
        />
        <Route 
          path="/video"
          element={
            <Video />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;