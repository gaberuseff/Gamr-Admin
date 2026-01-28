import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser as deleteUserApi } from "../../services/apiUsers";
import toast from "react-hot-toast";

function useDeleteUser() {
    const queryClient = useQueryClient();

    const { mutateAsync: deleteUser, isPending: deletePending } = useMutation({
        mutationFn: (userId) => deleteUserApi(userId),

        onSuccess: () => {
            toast.success("تم حذف المستخدم بنجاح");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },

        onError: (error) => {
            console.log(error);
            toast.error('فشل حذف المستخدم');
        }
    })

    return {
        deleteUser,
        deletePending
    }
}

export default useDeleteUser
