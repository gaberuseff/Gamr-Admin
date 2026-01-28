import { useQuery } from "@tanstack/react-query"
import { getTopSellingProducts } from "../../services/apiDashboard"

function useTopSelling(days = 7, limit = 5) {
    const { data: topSellingProducts, isPending: isTopSellingProductsPending, error: topSellingProductsError } = useQuery({
        queryKey: ["top-selling-products", days, limit],
        queryFn: () => getTopSellingProducts(days, limit),
    })

    return { topSellingProducts, isTopSellingProductsPending, topSellingProductsError }
}

export default useTopSelling;