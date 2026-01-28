
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { manageUser } from "../../services/apiUsers"
import toast from "react-hot-toast";

function useUpdateUser() {
    const queryClient = useQueryClient();

    const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
        mutationFn: ({ userId, action }) => manageUser({ userId, action }),

        onSuccess: (data, variables) => {
            const actionMessages = {
                block: "تم حظر المستخدم بنجاح",
                unblock: "تم إلغاء حظر المستخدم بنجاح",
                delete: "تم حذف المستخدم بنجاح"
            };

            toast.success(actionMessages[variables.action] || "تم تحديث المستخدم بنجاح");

            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error.message || "حدث خطأ أثناء تحديث المستخدم");
        }
    })

    return { updateUser, isUpdatingUser }
}

export default useUpdateUser