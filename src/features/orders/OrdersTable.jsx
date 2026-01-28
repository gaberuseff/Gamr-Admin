import {
    Chip,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@heroui/react";
import { useCallback } from "react";
import { HiEye } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Center from "../../ui/Center";
import { formateCurrency } from "../../utils/helpers";
import useOrders from "./useOrders";

export const columns = [
    { name: "رقم الطلب", uid: "id" },
    { name: "العميل", uid: "customer", width: "200px" },
    { name: "المبلغ الكلي", uid: "total" },
    { name: "حالة الدفع", uid: "isPaid" },
    { name: "الحالة", uid: "status" },
    { name: "الإجراءات", uid: "actions" },
];

const statusColorMap = {
    received: "warning",
    confirmed: "primary",
    shipped: "success",
    cancelled: "danger",
};

function OrdersTable() {
    const navigate = useNavigate();
    const { orders, isLoading, currentPage, totalPages, setSearchParams } = useOrders();

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() });
    };

    const renderCell = useCallback((order, columnKey) => {
        const cellValue = order[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div>
                        <p className="font-semibold text-sm">{order.id}</p>
                    </div>
                );
            case "customer":
                return (
                    <div className="max-w-[200px] text-right">
                        <p className="font-semibold text-sm truncate" title={order.customer_name}>{order.customer_name}</p>
                        <p className="text-sm text-default-400 truncate" title={order.phone}>{order.phone}</p>
                    </div>
                );
            case "total":
                return (
                    <div className="flex flex-col">
                        <p className="font-semibold text-sm">{formateCurrency(order.total)}</p>
                    </div>
                );
            case "isPaid":
                return (
                    <Chip
                        className="capitalize"
                        color={order.isPaid ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                    >
                        {order.isPaid ? "مدفوع" : "غير مدفوع"}
                    </Chip>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[order.status] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {order.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-4">
                        <Tooltip content="تفاصيل" >
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                <HiEye />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [navigate]);

    if (isLoading) {
        return <Center><Spinner size="lg" /></Center>
    }

    return (
        <div className="flex flex-col gap-4">
            <Table aria-label="Orders Table" shadow="none">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            width={column.width}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={orders || []}>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-12">
                                لا توجد طلبات
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-end items-center gap-4 px-12">
                <Pagination
                    color="primary"
                    page={currentPage}
                    total={totalPages}
                    onChange={handlePageChange}
                    showControls
                />
            </div>
        </div>
    );
}

export default OrdersTable;
