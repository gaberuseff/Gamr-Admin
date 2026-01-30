import {
    Button, Checkbox, Form, Input, Modal, ModalBody,
    ModalContent,
    ModalHeader, Select, SelectItem
} from "@heroui/react";
import { useEffect, useState } from "react";
import useUpdateDiscountCode from "./useUpdateDiscountCode";

// Helper function to format date for input[type="date"]
function formatDateForInput(dateString) {
    if (!dateString) return "";
    // If date is already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    // Otherwise, parse and format
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function EditDiscountCode({ isOpen, onOpenChange, discount }) {
    const [isActive, setIsActive] = useState(false);
    const { updateDiscountCode, isUpdating } = useUpdateDiscountCode();

    // Update isActive when discount changes
    useEffect(() => {
        if (discount) {
            setIsActive(discount.is_active || false);
        }
    }, [discount]);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);

        // Convert and clean data
        const data = {
            code: rawData.code,
            discount_type: rawData.discount_type,
            discount_value: Number(rawData.discount_value),
            min_order_amount: Number(rawData.min_order_amount),
            max_discount_amount: rawData.max_discount_amount ? Number(rawData.max_discount_amount) : null,
            usage_limit: rawData.usage_limit ? Number(rawData.usage_limit) : null,
            start_date: rawData.start_date,
            end_date: rawData.end_date,
            is_active: isActive
        };

        updateDiscountCode({ id: discount.id, data }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    if (!discount) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            تعديل كود الخصم
                        </ModalHeader>
                        <ModalBody>
                            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                {/* Row 1: Code and Discount Type */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Input
                                        isRequired
                                        label="اسم الكود"
                                        labelPlacement="outside"
                                        name="code"
                                        placeholder="أدخل اسم الكود"
                                        type="text"
                                        defaultValue={discount.code}
                                    />

                                    <Select
                                        isRequired
                                        label="نوع الخصم"
                                        labelPlacement="outside"
                                        name="discount_type"
                                        placeholder="اختر نوع الخصم"
                                        defaultSelectedKeys={[discount.discount_type]}
                                    >
                                        <SelectItem key="percentage">نسبة مئوية (%)</SelectItem>
                                        <SelectItem key="fixed">قيمة ثابتة (جنيه)</SelectItem>
                                    </Select>
                                </div>

                                {/* Row 2: Discount Value and Min Order Amount */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Input
                                        isRequired
                                        label="قيمة الخصم"
                                        labelPlacement="outside"
                                        name="discount_value"
                                        placeholder="أدخل قيمة الخصم"
                                        type="number"
                                        min="0"
                                        defaultValue={discount.discount_value?.toString()}
                                    />

                                    <Input
                                        isRequired
                                        label="الحد الأدنى للطلب"
                                        labelPlacement="outside"
                                        name="min_order_amount"
                                        placeholder="أدخل الحد الأدنى للطلب"
                                        type="number"
                                        min="0"
                                        defaultValue={discount.min_order_amount?.toString()}
                                    />
                                </div>

                                {/* Row 3: Max Discount Amount and Usage Limit */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Input
                                        label="الحد الأقصى للخصم"
                                        labelPlacement="outside"
                                        name="max_discount_amount"
                                        placeholder="أدخل الحد الأقصى للخصم (اختياري)"
                                        type="number"
                                        min="0"
                                        defaultValue={discount.max_discount_amount?.toString() || ""}
                                    />

                                    <Input
                                        label="عدد مرات الاستخدام"
                                        labelPlacement="outside"
                                        name="usage_limit"
                                        placeholder="اترك فارغًا للاستخدام غير المحدود"
                                        type="number"
                                        min="1"
                                        defaultValue={discount.usage_limit?.toString() || ""}
                                    />
                                </div>

                                {/* Row 4: Start Date and End Date */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Input
                                        isRequired
                                        label="تاريخ البدء"
                                        labelPlacement="outside"
                                        name="start_date"
                                        type="date"
                                        defaultValue={formatDateForInput(discount.start_date)}
                                    />

                                    <Input
                                        isRequired
                                        label="تاريخ الانتهاء"
                                        labelPlacement="outside"
                                        name="end_date"
                                        type="date"
                                        defaultValue={formatDateForInput(discount.end_date)}
                                    />
                                </div>

                                {/* Row 5: Active Status */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        name="is_active"
                                        isSelected={isActive}
                                        onValueChange={setIsActive}
                                    >
                                        تفعيل الكود
                                    </Checkbox>
                                </div>

                                <Button color="primary" className="mt-4" type="submit" isLoading={isUpdating}>
                                    تحديث الكود
                                </Button>
                            </Form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default EditDiscountCode;
