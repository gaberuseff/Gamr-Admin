import {
    Form,
    Select,
    SelectItem,
    Button
} from "@heroui/react";
import { useState } from "react";
import { HiOutlineArrowsUpDown, HiEye, HiXMark } from "react-icons/hi2";

const dataTypes = [
    { key: "orders", label: "الطلبات" },
    { key: "products", label: "المنتجات" },
];

const timePeriods = [
    { key: "today", label: "اليوم" },
    { key: "yesterday", label: "الامس" },
    { key: "this_week", label: "هذا الأسبوع" },
    { key: "this_month", label: "هذا الشهر" },
    { key: "3_months", label: "3 أشهر" },
    { key: "this_year", label: "هذا العام" },
];

function ExportSelectionForm({ onSubmit, isLoading, onCancel }) {
    const [selectedDataType, setSelectedDataType] = useState("");

    const handleDataTypeChange = (value) => {
        setSelectedDataType(value);
    };

    return (
        <Form
            className="w-full flex flex-col gap-5"
            onSubmit={onSubmit}
        >
            <Select
                disableSelectorIconRotation
                label="نوع البيانات"
                labelPlacement="outside"
                isRequired
                name="data_type"
                placeholder="اختر نوع البيانات"
                selectorIcon={<HiOutlineArrowsUpDown />}
                isDisabled={isLoading}
                size="md"
                onChange={(e) => handleDataTypeChange(e.target.value)}
            >
                {dataTypes.map((type) => (
                    <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
            </Select>

            {selectedDataType === "orders" && (
                <Select
                    disableSelectorIconRotation
                    label="الفترة الزمنية"
                    name="time_period"
                    labelPlacement="outside"
                    isRequired
                    placeholder="اختر الفترة الزمنية"
                    selectorIcon={<HiOutlineArrowsUpDown />}
                    isDisabled={isLoading}
                    size="md"
                >
                    {timePeriods.map((period) => (
                        <SelectItem key={period.key}>{period.label}</SelectItem>
                    ))}
                </Select>
            )}

            <div className="flex gap-3 justify-end mt-2">
                <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    size="md"
                >
                    {isLoading ? "جاري التحميل..." : "معاينة البيانات"}
                </Button>
                <Button
                    variant="flat"
                    onPress={onCancel}
                    isDisabled={isLoading}
                    size="md"
                >
                    إلغاء
                </Button>
            </div>
        </Form>
    );
}

export default ExportSelectionForm;
