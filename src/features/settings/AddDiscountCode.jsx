import {
    Button, Checkbox, Form, Input, Modal, ModalBody,
    ModalContent,
    ModalHeader, Select, SelectItem, useDisclosure
} from "@heroui/react";
import { useState } from "react";
import useAddDiscountCode from "./useAddDiscountCode";

function AddDiscountCode() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isActive, setIsActive] = useState(false);
    const { addDiscountCode, isAddingDiscountCode } = useAddDiscountCode();

    function handelSubmit(e) {
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

        addDiscountCode(data, {
            onSuccess: () => {
                onOpenChange();
            }
        });
    }

    return (
        <div>
            <Button onPress={onOpen} variant="flat" color="primary">
                إضافة كود خصم
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                إضافة كود خصم جديد
                            </ModalHeader>
                            <ModalBody>
                                <Form className="flex flex-col gap-4" onSubmit={handelSubmit}>
                                    {/* Row 1: Code and Discount Type */}
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <Input
                                            isRequired
                                            label="اسم الكود"
                                            labelPlacement="outside"
                                            name="code"
                                            placeholder="أدخل اسم الكود"
                                            type="text"
                                        />

                                        <Select
                                            isRequired
                                            label="نوع الخصم"
                                            labelPlacement="outside"
                                            name="discount_type"
                                            placeholder="اختر نوع الخصم"
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
                                        />

                                        <Input
                                            isRequired
                                            label="الحد الأدنى للطلب"
                                            labelPlacement="outside"
                                            name="min_order_amount"
                                            placeholder="أدخل الحد الأدنى للطلب"
                                            type="number"
                                            min="0"
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
                                        />

                                        <Input
                                            label="عدد مرات الاستخدام"
                                            labelPlacement="outside"
                                            name="usage_limit"
                                            placeholder="اترك فارغًا للاستخدام غير المحدود"
                                            type="number"
                                            min="1"
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
                                        />

                                        <Input
                                            isRequired
                                            label="تاريخ الانتهاء"
                                            labelPlacement="outside"
                                            name="end_date"
                                            type="date"
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

                                    <Button color="primary" className="mt-4" type="submit" isLoading={isAddingDiscountCode}>
                                        إضافة الكود
                                    </Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AddDiscountCode;
