import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../services/apiAuth";
import { authStorage } from "../../utils/authStorage";

function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutateAsync: logout, isPending: isLogoutPending } = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            authStorage.clearSession();
            queryClient.clear(); // مسح جميع البيانات من الكاش
            toast.success("تم تسجيل الخروج");
            navigate("/login");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    return { logout, isLogoutPending };
}

export default useLogout;
