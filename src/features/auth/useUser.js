import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

function useUser() {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    })

    const isAuthenticated = !!user && user.role === 'authenticated';
    const userType = user?.user_metadata?.role;
    const isOwner = userType === 'admin';
    const isBanned = user?.app_metadata?.banned;

    return { user, isLoading, isAuthenticated, userType, isOwner, isBanned }
}

export default useUser