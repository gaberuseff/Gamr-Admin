import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProduct as deleteProductApi } from "../../services/apiProducts";

function useDeleteProduct() {
    const queryClient = useQueryClient();

    const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
        mutationFn: (productId) => deleteProductApi(productId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("تم حذف المنتج بنجاح");
        },

        onError: (error) => {
            console.error("Product deletion failed:", error);
            toast.error("فشل حذف المنتج");
        }
    });

    return { deleteProduct, isDeletingProduct };
}

export default useDeleteProduct;
