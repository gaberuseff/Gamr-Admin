import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct as createProductApi } from "../../services/apiProducts";
import { toast } from "react-hot-toast";

function useCreateProduct() {
    const queryClient = useQueryClient();

    const { mutateAsync: createProduct, isPending: isCreatingProduct } = useMutation({
        mutationFn: createProductApi,
        onSuccess: () => {
            toast.success("تم إضافة المنتج بنجاح");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء إضافة المنتج');
        }
    });

    return {
        createProduct,
        isCreatingProduct
    };
}

export default useCreateProduct;