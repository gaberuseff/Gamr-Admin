import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePassword as updatePasswordApi } from "../../services/apiAuth";

function useUpdatePassword() {
    const queryClient = useQueryClient();

    const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation({
        mutationFn: updatePasswordApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("تم تحديث كلمة المرور بنجاح");
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء تحديث كلمة المرور');
        },
    });

    return { updatePassword, isUpdatingPassword };
}

export default useUpdatePassword;