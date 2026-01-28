import { Button, Chip, Spinner } from "@heroui/react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Center from "../../ui/Center";
import CustomerData from "./CustomerData";
import OrderBox from "./OrderBox";
import OrderNotFound from "./OrderNotFound";
import useOrder from "./useOrder";
import useUpdateOrder from "./useUpdateOrder";

const statusColorMap = {
    received: "warning",
    confirmed: "primary",
    shipped: "success",
    cancelled: "danger",
};

function OrderDetails() {
    const navigate = useNavigate();
    const { order, isLoadingOrder, error } = useOrder();

    const { updateOrder, isLoadingUpdateOrder } = useUpdateOrder();

    if (isLoadingOrder) {
        return <Center><Spinner size="lg" /></Center>
    }

    // معالجة الخطأ إذا كان الطلب غير موجود
    if (error || !order) {
        return <OrderNotFound />
    }

    function handleUpdateOrder(status) {
        updateOrder({ id: order.id, data: { status } });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                    <h1 className="text-2xl">طلب رقم #
                        <span className="font-bold">{order.id}</span>
                    </h1>
                    <Chip
                        className="capitalize"
                        color={statusColorMap[order.status] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {order.status}
                    </Chip>
                </div>

                <Button color="default" variant="bordered"
                    onClick={() => navigate("/orders")}
                    endContent={<HiArrowLeft />}>الرجوع</Button>
            </div>

            <CustomerData order={order} />

            <OrderBox order={order} />

            <div className="flex items-center gap-4">
                {
                    order.status == 'received' ? (
                        <Button color="primary"
                            isDisabled={order.status === "shipped"
                                || order.status === "cancelled"}
                            onPress={() => handleUpdateOrder("confirmed")}
                            isLoading={isLoadingUpdateOrder}
                        >
                            تأكيد الطلب
                        </Button>
                    ) : (
                        order.status == 'confirmed' ? (
                            <Button color="primary"
                                isDisabled={order.status === "shipped"
                                    || order.status === "cancelled"}
                                onPress={() => handleUpdateOrder("shipped")}
                                isLoading={isLoadingUpdateOrder}
                            >
                                تأكيد التسليم
                            </Button>
                        ) : (
                            order.status == 'shipped' ? (
                                <Button color="primary"
                                    isDisabled={order.status === "shipped"
                                        || order.status === "cancelled"}>تم الشحن</Button>
                            ) : (
                                order.status == 'cancelled' ? (
                                    <Button color="primary" isDisabled={order.status === "shipped"
                                        || order.status === "cancelled"}>تم الإلغاء</Button>
                                ) : (
                                    <Button color="primary" isDisabled={order.status === "shipped"
                                        || order.status === "cancelled"}>تأكيد الطلب</Button>
                                )
                            )
                        )
                    )
                }

                <Button color="danger" isDisabled={order.status === "shipped" || order.status === "cancelled"}
                    onPress={() => handleUpdateOrder("cancelled")}
                    isLoading={isLoadingUpdateOrder}
                >إلغاء الطلب</Button>
            </div>
        </div>
    )
}

export default OrderDetails
