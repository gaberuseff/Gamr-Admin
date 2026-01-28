import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getOrder } from "../../services/apiOrders"

function useOrder() {
    const { orderId } = useParams();

    const { data: order, isPending: isLoadingOrder, error } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrder(orderId),
        retry: false,
    })
    return { order, isLoadingOrder, error }
}

export default useOrder