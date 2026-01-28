import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOrdersStatusChart } from "../../services/apiDashboard";

function useOrdersSatusChart() {
    const [searchParams] = useSearchParams();
    const numDays = searchParams.get("last") || "7";

    const { data: ordersStatusChart, isPending: isOrdersStatusChartPending, error: ordersStatusChartError } = useQuery({
        queryKey: ["orders-status-chart", numDays],
        queryFn: () => getOrdersStatusChart(numDays),
    })

    return { ordersStatusChart, isOrdersStatusChartPending, ordersStatusChartError }
}

export default useOrdersSatusChart