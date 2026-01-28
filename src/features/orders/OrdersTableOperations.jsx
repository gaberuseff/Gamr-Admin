import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function OrdersTableOperations() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

    const handleSearch = () => {
        if (searchValue.trim()) {
            searchParams.set("search", searchValue.trim());
            searchParams.set("page", "1"); // Reset to first page on new search
        } else {
            searchParams.delete("search");
        }
        setSearchParams(searchParams);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleClearFilters = () => {
        // Clear all filters and search
        setSearchParams({});
        setSearchValue("");
    };

    return (
        <div className="flex gap-2 items-center mb-4">
            <Filter filterField="status" options={[
                { value: "all", label: "الكل" },
                { value: "received", label: "مستلم" },
                { value: "confirmed", label: "مؤكد" },
                { value: "shipped", label: "تم الشحن" },
                { value: "cancelled", label: "ملغي" }
            ]} />

            <SortBy options={[
                { value: "totalPrice-desc", label: "الاعلى سعر" },
                { value: "totalPrice-asc", label: "الاقل سعر" },
                { value: "createdAt-desc", label: "الاحدث" },
                { value: "createdAt-asc", label: "الاقدم" }
            ]} />

            <Input
                placeholder="بحث برقم الطلب او الهاتف (اضغط Enter)"
                type="text"
                className="max-w-xs"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
            />

            <Button
                color="danger"
                variant="flat"
                size="md"
                onClick={handleClearFilters}
            >
                مسح الفلاتر
            </Button>
        </div>
    )
}

export default OrdersTableOperations
