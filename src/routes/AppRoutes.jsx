import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import RedirectHandler from "./RedirectHandler";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const StudentResultPortal = lazy(
  () => import("../pages/dbatu/MarksDetailPage"),
);

const isValidUserSession = () => {
  const userRaw = sessionStorage.getItem("user");
  if (!userRaw) return false;

  try {
    const userData = JSON.parse(userRaw);
    return (
      userData && typeof userData === "object" && userData.emp_Id !== undefined
    );
  } catch (e) {
    sessionStorage.removeItem("user");
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isValidUserSession() ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RedirectHandler />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/results" element={<StudentResultPortal />} />
            <Route
              path="/dashboard"
              element={
                <div style={{ padding: 20 }}>
                  <h3>Dashboard Overview</h3>
                </div>
              }
            />
            <Route
              path="/reports"
              element={
                <div style={{ padding: 20 }}>
                  <h3>Reports Portal</h3>
                </div>
              }
            />
            <Route path="/" element={<Navigate to="/results" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
