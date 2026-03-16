import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const PrivateRoute = () => {
    const { firebaseUser, isLoading } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Verificando Credenciales...</div>;

    return firebaseUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { role, isLoading, firebaseUser } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Verificando Autorización Administrador...</div>;

    return (firebaseUser && role === "ADMIN") ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export const EmployeeRoute = () => {
    const { role, isLoading, firebaseUser } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Verificando Autorización Operativa...</div>;

    return (firebaseUser && (role === "EMPLOYEE" || role === "ADMIN")) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export const ClientRoute = () => {
    const { role, isLoading, firebaseUser } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Conectando a Bóveda del Cliente...</div>;

    return (firebaseUser && role === "CLIENT") ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
