import { useQuery } from "@tanstack/react-query";
import { getDiscounts } from "../../services/apiSettings";

function useDiscounts() {
    const { data: discounts, isPending: isDiscountsLoading } = useQuery({
        queryKey: ["discounts"],
        queryFn: getDiscounts,
    });

    return { discounts, isDiscountsLoading };
}

export default useDiscounts;
