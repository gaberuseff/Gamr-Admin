import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createUser as createUserApi } from "../../services/apiUsers";

function useCreateUser() {
    const queryClient = useQueryClient();
    const { mutate: createUser, isPending: isCreatingUser } = useMutation({
        mutationFn: (data) => createUserApi(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("تم إضافة المستخدم بنجاح");
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء إضافة المستخدم');
        }
    })

    return { createUser, isCreatingUser }
}

export default useCreateUser
