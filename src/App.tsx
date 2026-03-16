import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/auth/ProtectedRoutes";
import { Login } from "./pages/auth/Login";
import { AuthAction } from "./pages/auth/AuthAction";
import LandingPage from "./pages/LandingPage";

import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";

// Componente para evitar que el usuario autenticado vuelva al login
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { firebaseUser, role } = useAuth();

  if (firebaseUser && role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-200">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/auth/action" element={<PublicRoute><AuthAction /></PublicRoute>} />

            {/* Rutas con Protección de RBAC general */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center text-red-500">Acceso Denegado (No posees los Claims necesarios)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
