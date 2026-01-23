import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/apiProducts";
import { ITEMS_PER_PAGE } from "../../utils/constants";

function useProducts() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;

    const {
        data,
        isPending: isProductsPending,
        error: productsError
    } = useQuery({
        queryKey: ['products', currentPage],
        queryFn: () => getProducts(currentPage),
        keepPreviousData: true, // Keep previous data while fetching new page
    });

    return {
        products: data?.data || [],
        count: data?.count || 0,
        isProductsPending,
        productsError,
        currentPage,
        setSearchParams,
        totalPages: Math.ceil(data?.count / ITEMS_PER_PAGE),
    };
}

export default useProducts