import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addDiscountCode as addDiscountCodeAPI } from "../../services/apiSettings";

function useAddDiscountCode() {
    const queryClient = useQueryClient();

    const { mutate: addDiscountCode, isPending: isAddingDiscountCode } = useMutation({
        mutationFn: (data) => addDiscountCodeAPI(data),
        onSuccess: () => {
            toast.success("تم إضافة كود الخصم بنجاح");
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { addDiscountCode, isAddingDiscountCode };
}

export default useAddDiscountCode
