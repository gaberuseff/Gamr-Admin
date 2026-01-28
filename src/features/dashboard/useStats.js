import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getDashboardStats } from "../../services/apiDashboard";

function useStats() {
    const [searchParams] = useSearchParams();
    const numDays = searchParams.get("last") || "7";

    const { data: stats, isPending: isStatsPending, error: statsError } = useQuery({
        queryKey: ["stats", numDays],
        queryFn: () => getDashboardStats(numDays),
    })

    return { stats, isStatsPending, statsError }
}

export default useStats
