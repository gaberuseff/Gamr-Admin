import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteOrders as deleteOrdersApi } from "../../services/apiOrders";

function useDeleteOrders() {
    const queryClient = useQueryClient();

    const { mutate: deleteOrders, isPending: isDeleting } = useMutation({
        mutationFn: (data) => deleteOrdersApi(data),
        onSuccess: () => {
            toast.success("تم حذف الطلبات بنجاح");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err) => {
            toast.error(err.message || "فشل حذف الطلبات");
        }
    });

    return { deleteOrders, isDeleting };
}

export default useDeleteOrders;