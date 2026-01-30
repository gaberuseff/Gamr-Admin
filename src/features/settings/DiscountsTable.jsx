import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import { useState } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Center from "../../ui/Center";
import EditDiscountCode from "./EditDiscountCode";
import useDeleteDiscountCode from "./useDeleteDiscountCode";
import useDiscounts from "./useDiscounts";

const columns = [
    {
        key: "code",
        label: "الكود",
    },
    {
        key: "discount_type",
        label: "نوع الخصم",
    },
    {
        key: "discount_value",
        label: "قيمة الخصم",
    },
    {
        key: "min_order_amount",
        label: "الحد الأدنى للطلب",
    },
    {
        key: "max_discount_amount",
        label: "الحد الأقصى للخصم",
    },
    {
        key: "start_date",
        label: "تاريخ البدء",
    },
    {
        key: "end_date",
        label: "تاريخ الانتهاء",
    },
    {
        key: "is_active",
        label: "الحالة",
    },
    {
        key: "actions",
        label: "الإجراءات",
    }
];

function DiscountsTable() {
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { discounts, isDiscountsLoading } = useDiscounts();
    const { deleteDiscountCode, isDeleting } = useDeleteDiscountCode();

    const handleDeleteClick = (discountId) => {
        setSelectedDiscountId(discountId);
        onOpen();
    };

    const handleEditClick = (discount) => {
        setSelectedDiscount(discount);
        onEditOpen();
    };

    const handleConfirmDelete = () => {
        if (selectedDiscountId) {
            deleteDiscountCode(selectedDiscountId, {
                onSuccess: () => {
                    onOpenChange(false);
                }
            });
        }
    };

    if (isDiscountsLoading) {
        return <Center><Spinner size="lg" /></Center>;
    }

    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "discount_type":
                return cellValue === "percentage" ? "نسبة مئوية (%)" : "قيمة ثابتة (جنيه)";

            case "discount_value":
                return item.discount_type === "percentage"
                    ? `${cellValue}%`
                    : `${cellValue} جنيه`;

            case "min_order_amount":
            case "max_discount_amount":
                return cellValue ? `${cellValue} جنيه` : "-";

            case "start_date":
            case "end_date":
                return cellValue ? new Date(cellValue).toLocaleDateString('ar-EG') : "-";

            case "is_active":
                return (
                    <Chip
                        color={cellValue ? "success" : "danger"}
                        variant="flat"
                        size="sm"
                    >
                        {cellValue ? "مفعل" : "غير مفعل"}
                    </Chip>
                );

            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-4">
                        <Tooltip content="تعديل كود الخصم">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => handleEditClick(item)}
                            >
                                <HiOutlinePencil />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="حذف كود الخصم">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDeleteClick(item.id)}
                            >
                                <HiOutlineTrash />
                            </span>
                        </Tooltip>
                    </div>
                );

            default:
                return cellValue || "-";
        }
    };

    return (
        <>
            <Table aria-label="جدول الخصومات" shadow="none">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                {discounts?.length > 0 ? (
                    <TableBody items={discounts}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                ) : (
                    <TableBody emptyContent={"لا يوجد أكواد خصم"}>
                        {[]}
                    </TableBody>
                )}
            </Table>

            {/* Modal حذف كود الخصم */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                حذف كود الخصم
                            </ModalHeader>
                            <ModalBody>
                                <p>هل أنت متأكد من حذف كود الخصم؟</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    إلغاء
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleConfirmDelete}
                                    isLoading={isDeleting}
                                >
                                    حذف
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal تعديل كود الخصم */}
            <EditDiscountCode
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                discount={selectedDiscount}
            />
        </>
    );
}

export default DiscountsTable;
