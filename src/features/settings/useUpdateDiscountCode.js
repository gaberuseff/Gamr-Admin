import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateDiscountCode as updateDiscountCodeApi } from "../../services/apiSettings";

function useUpdateDiscountCode() {
    const queryClient = useQueryClient();

    const { mutate: updateDiscountCode, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, data }) => updateDiscountCodeApi(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            toast.success("تم تحديث كود الخصم بنجاح");
        },
        onError: (error) => {
            console.log(error);
            toast.error('فشل تحديث كود الخصم');
        },
    });

    return { updateDiscountCode, isUpdating };
}

export default useUpdateDiscountCode;