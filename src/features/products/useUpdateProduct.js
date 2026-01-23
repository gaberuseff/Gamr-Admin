import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct as updateProductApi } from "../../services/apiProducts";
import { toast } from "react-hot-toast";

function useUpdateProduct() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateProduct, isPending: isUpdatingProduct } = useMutation({
        mutationFn: ({ productId, productData }) => updateProductApi(productId, productData),
        onSuccess: () => {
            toast.success("تم تعديل المنتج بنجاح");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.error('Error updating product:', error);
            toast.error(error.message || 'حدث خطأ أثناء تعديل المنتج');
        }
    });

    return {
        updateProduct,
        isUpdatingProduct
    };
}

export default useUpdateProduct;
