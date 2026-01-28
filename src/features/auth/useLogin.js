import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuth";
import { authStorage } from "../../utils/authStorage";

function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: login, isPending: isLoginPending } = useMutation({
        mutationFn: ({ email, password }) => loginApi({ email, password }),

        onSuccess: (session) => {
            // Save session to local storage
            authStorage.saveSession(session);

            // Update user query cache with the logged-in user data
            queryClient.setQueryData(["user"], session.user);

            toast.success("تم تسجيل الدخول");
            navigate("/dashboard");
        },

        onError: (err) => {
            console.log(err);
            toast.error("الايميل أو كلمة المرور غير صحيح");
        }
    })

    return { login, isLoginPending }
}

export default useLogin