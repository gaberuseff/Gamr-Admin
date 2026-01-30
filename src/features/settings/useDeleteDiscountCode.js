import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDiscountCode as deleteDiscountCodeApi } from "../../services/apiSettings"
import toast from "react-hot-toast";


function useDeleteDiscountCode() {
    const queryClient = useQueryClient();

    const { mutate: deleteDiscountCode, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deleteDiscountCodeApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            toast.success("تم حذف كود الخصم بنجاح");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    })
    return { deleteDiscountCode, isDeleting }
}

export default useDeleteDiscountCode