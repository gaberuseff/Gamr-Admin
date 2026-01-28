import { Spinner } from "@heroui/react";
import { Navigate } from "react-router-dom";
import useUser from "../features/auth/useUser";

function PublicRoute({ children }) {
    const { isLoading, isAuthenticated } = useUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute
