import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOrders } from "../../services/apiOrders";
import { ORDERS_PER_PAGE } from "../../utils/constants";

function useOrders() {
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy");
    const search = searchParams.get("search");
    const currentPage = Number(searchParams.get("page")) || 1;

    const {
        data,
        isPending: isLoading
    } = useQuery({
        queryKey: ["orders", status, sortBy, search, currentPage],
        queryFn: () => getOrders({ status, sortBy, search, page: currentPage }),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    return {
        orders: data?.data || [],
        count: data?.count || 0,
        isLoading,
        currentPage,
        setSearchParams,
        totalPages: Math.ceil((data?.count || 0) / ORDERS_PER_PAGE),
    };
}

export default useOrders;
