import {
    Button, Form,
    Modal, ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Spinner,
    useDisclosure
} from "@heroui/react";
import { useState } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { getOrdersCount } from "../../services/apiOrders";
import useDeleteOrders from "./useDeleteOrders";

const ordersDates = [
    {
        label: "كل الطلبات",
        value: "all"
    },
    {
        label: "الطلبات قبل شهر",
        value: "1"
    },
    {
        label: "الطلبات قبل شهرين",
        value: "2"
    },
    {
        label: "الطلبات قبل 3 شهور",
        value: "3"
    },
    {
        label: "الطلبات قبل 4 شهور",
        value: "4"
    },
    {
        label: "الطلبات قبل 5 شهور",
        value: "5"
    },
    {
        label: "الطلبات قبل 6 شهور",
        value: "6"
    },
    {
        label: "الطلبات قبل 7 شهور",
        value: "7"
    },
    {
        label: "الطلبات قبل 8 شهور",
        value: "8"
    },
    {
        label: "الطلبات قبل 9 شهور",
        value: "9"
    },
    {
        label: "الطلبات قبل 10 شهور",
        value: "10"
    },
    {
        label: "الطلبات قبل 11 شهر",
        value: "11"
    },
    {
        label: "الطلبات قبل 12 شهر",
        value: "12"
    }
]

const ordersStatus = [
    {
        label: "الطلبات الملغاة",
        value: "cancelled"
    },
    {
        label: "تم شحنها",
        value: "shipped"
    }
]

function DeleteOrdersBtn() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
    const { deleteOrders, isDeleting } = useDeleteOrders();

    const [selectedData, setSelectedData] = useState(null);
    const [ordersCount, setOrdersCount] = useState(null);
    const [isLoadingCount, setIsLoadingCount] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        // Calculate date based on months selected
        let calculatedDate = null;
        let dateLabel = "كل الطلبات";

        if (data.orderDate && data.orderDate !== "all") {
            const monthsAgo = parseInt(data.orderDate);
            const date = new Date();
            date.setMonth(date.getMonth() - monthsAgo);
            calculatedDate = date.toISOString();
            dateLabel = date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        const statusLabel = ordersStatus.find(s => s.value === data.orderStatus)?.label || data.orderStatus;

        // Store selected data
        const deleteData = {
            status: data.orderStatus || "all",
            date: calculatedDate || "all",
            statusLabel,
            dateLabel
        };

        setSelectedData(deleteData);

        // Get count of orders to be deleted
        setIsLoadingCount(true);
        try {
            const count = await getOrdersCount({
                status: deleteData.status,
                date: deleteData.date
            });
            setOrdersCount(count);

            // Close first modal and open confirmation modal
            onOpenChange(false);
            onConfirmOpen();
        } catch (error) {
            console.error("Error getting orders count:", error);
            setOrdersCount(0);
        } finally {
            setIsLoadingCount(false);
        }
    }

    function handleConfirmDelete() {
        if (selectedData) {
            deleteOrders(
                {
                    status: selectedData.status,
                    date: selectedData.date
                },
                {
                    onSuccess: () => {
                        onConfirmOpenChange(false);
                        setSelectedData(null);
                        setOrdersCount(null);
                    }
                }
            );
        }
    }

    return (
        <div className="">
            <Button color="danger" variant="flat" size="md" onPress={onOpen}>
                مسح بعض الطلبات
            </Button>

            {/* Selection Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" className="py-4">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                حذف بعض الطلبات من قاعدة البيانات بناء على شروط معينة
                            </ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4"
                                    onSubmit={handleSubmit}
                                >
                                    <Select
                                        disableSelectorIconRotation
                                        className="w-full"
                                        label="حالة الطلب"
                                        labelPlacement="outside"
                                        placeholder="اختر حالة الطلب"
                                        name="orderStatus"
                                        isRequired
                                    >
                                        {ordersStatus.map((orderStatus) => (
                                            <SelectItem key={orderStatus.value}>
                                                {orderStatus.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Select
                                        disableSelectorIconRotation
                                        className="w-full"
                                        label="تاريخ الطلب"
                                        labelPlacement="outside"
                                        placeholder="اختر تاريخ الطلب"
                                        name="orderDate"
                                        isRequired
                                    >
                                        {ordersDates.map((orderDate) => (
                                            <SelectItem key={orderDate.value}>
                                                {orderDate.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            color="primary"
                                            type="submit"
                                            isLoading={isLoadingCount}
                                            isDisabled={isLoadingCount}
                                        >
                                            التالي
                                        </Button>
                                        <Button
                                            color="default"
                                            variant="flat"
                                            onPress={onClose}
                                            isDisabled={isLoadingCount}
                                        >
                                            إلغاء
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Confirmation Modal */}
            <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-2 items-center text-danger">
                                <HiExclamationTriangle className="text-2xl" />
                                تأكيد الحذف
                            </ModalHeader>
                            <ModalBody className="py-6">
                                {isLoadingCount ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner size="lg" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Order Count */}
                                        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-center">
                                            <p className="text-sm text-default-600 mb-2">
                                                عدد الطلبات التي سيتم حذفها:
                                            </p>
                                            <p className="text-3xl font-bold text-danger">
                                                {ordersCount}
                                            </p>
                                            <p className="text-xs text-default-500 mt-1">
                                                طلب
                                            </p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-default-100 rounded-lg">
                                                <span className="text-sm font-medium">الحالة:</span>
                                                <span className="text-sm text-default-600">
                                                    {selectedData?.statusLabel}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center p-3 bg-default-100 rounded-lg">
                                                <span className="text-sm font-medium">التاريخ:</span>
                                                <span className="text-sm text-default-600">
                                                    {selectedData?.dateLabel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Warning Message */}
                                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                                            <p className="text-sm text-warning-800 text-center">
                                                ⚠️ سيتم حذف جميع الطلبات {selectedData?.statusLabel} التي تم إنشاؤها قبل تاريخ{' '}
                                                <strong>{selectedData?.dateLabel}</strong>
                                            </p>
                                            <p className="text-xs text-warning-700 text-center mt-2">
                                                هذا الإجراء لا يمكن التراجع عنه!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={onClose}
                                    isDisabled={isDeleting}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleConfirmDelete}
                                    isLoading={isDeleting}
                                    isDisabled={isDeleting || ordersCount === 0}
                                >
                                    تأكيد الحذف ({ordersCount})
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default DeleteOrdersBtn
