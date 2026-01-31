import { Spinner } from "@heroui/react";
import { useState } from "react";
import Error from "../../ui/Error";
import DashboardOperations from "./DashboardOperations";
import OrdersChart from "./OrdersChart";
import Stats from "./Stats";
import TopSellingProductsChart from "./TopSellingProductsChart";
import useOrdersStatusChart from "./useOrdersSatusChart";
import useStats from "./useStats";
import useTopSelling from "./useTopSelling";

function DashboardLayout() {
    const [productsLimit, setProductsLimit] = useState(5);

    const { stats, isStatsPending, statsError } = useStats()
    const { ordersStatusChart, isOrdersStatusChartPending, ordersStatusChartError } = useOrdersStatusChart()
    const { topSellingProducts, isTopSellingProductsPending, topSellingProductsError } = useTopSelling(7, productsLimit)

    if (isStatsPending || isOrdersStatusChartPending || isTopSellingProductsPending) return <div
        className="flex pt-40 justify-center"><Spinner size="lg" /></div>
    if (statsError || ordersStatusChartError || topSellingProductsError)
        return <Error message={statsError?.message || ordersStatusChartError?.message || topSellingProductsError?.message} />

    return (
        <div className="flex flex-col gap-4">
            <div>
                <DashboardOperations />
            </div>
            <Stats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopSellingProductsChart
                    topSellingProducts={topSellingProducts}
                    onLimitChange={setProductsLimit}
                    currentLimit={productsLimit}
                />
                <OrdersChart ordersStatusChart={ordersStatusChart} />
            </div>
        </div>
    )
}

export default DashboardLayout
