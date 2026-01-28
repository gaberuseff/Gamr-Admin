import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/apiUsers";

function useUsers() {
    const { data: users, isPending: isUsersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllUsers(),
    });

    return {
        users,
        isUsersLoading
    }
}

export default useUsers
