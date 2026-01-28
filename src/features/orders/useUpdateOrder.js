import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateOrder as updateOrderApi } from "../../services/apiOrders";

function useUpdateOrder() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateOrder, isPending: isLoadingUpdateOrder } = useMutation({
        mutationFn: ({ id, data }) => {
            return updateOrderApi(id, data);
        },

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("تم تحديث الطلب بنجاح");
        },

        onError: (err) => {
            console.log(err);
            toast.error("حدث خطأ أثناء تحديث الطلب");
        }
    })

    return { updateOrder, isLoadingUpdateOrder }
}

export default useUpdateOrder
