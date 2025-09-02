// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MainTabs from "./components/MainTabs";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent: React.FC = () => {
  const { login, signup, error, isLoading } = useAuth();

  // Login handler
  const handleLogin = async (userData: { email: string; password: string }) => {
    try {
      await login(userData.email, userData.password);
    } catch {
      // Error handled in AuthContext
    }
  };

  // Signup handler
  const handleSignup = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await signup(userData.name, userData.email, userData.password);
    } catch {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Login page */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}
                isLoading={isLoading}
                error={error || undefined}
              />
            }
          />

          {/* Signup page */}
          <Route
            path="/signup"
            element={
              <SignupPage
                onSignup={handleSignup}
                isLoading={isLoading}
                error={error || undefined}
              />
            }
          />

          {/* Protected home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainTabs />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <AppContent />
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
