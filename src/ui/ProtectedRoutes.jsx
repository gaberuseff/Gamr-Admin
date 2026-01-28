import { Spinner } from "@heroui/react";
import { Navigate } from "react-router-dom";
import useUser from "../features/auth/useUser";

function ProtectedRoutes({ children }) {
    // 1. Load the authenticated user
    const { isLoading, isAuthenticated } = useUser();

    // 2. Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    // 3. Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 4. Render protected content if authenticated
    return children;
}

export default ProtectedRoutes
