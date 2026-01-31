import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure
} from "@heroui/react";
import { useState } from "react";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import ExportPreview from "./ExportPreview";
import ExportSelectionForm from "./ExportSelectionForm";
import { useExportData } from "./useExportData";

function ExportBtn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDataType, setSelectedDataType] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("");

    const {
        isLoading,
        dataOverview,
        fetchDataForExport,
        exportToExcel,
        resetState
    } = useExportData();

    const handlePreview = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const dataType = formData.get("data_type");
        const timePeriod = formData.get("time_period") || "this_month"; // Default for products

        if (!dataType) {
            return;
        }

        // Time period is only required for orders
        if (dataType === "orders" && !timePeriod) {
            return;
        }

        setSelectedDataType(dataType);
        setSelectedTimePeriod(timePeriod);

        await fetchDataForExport(dataType, timePeriod);
    };

    const handleConfirmExport = () => {
        exportToExcel();
        handleClose();
    };

    const handleClose = () => {
        resetState();
        setSelectedDataType("");
        setSelectedTimePeriod("");
        onClose();
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3">
                <Button
                    endContent={<HiArrowUpOnSquare size={18} />}
                    className="capitalize bg-gray-900 text-white"
                    radius="full"
                    size="lg"
                    variant="flat"
                    onPress={onOpen}
                >
                    تصدير بيانات
                </Button>
            </div>

            <Modal backdrop="blur" isOpen={isOpen} onClose={handleClose} size="xl" className="py-4">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {dataOverview ? "معاينة البيانات" : "تصدير بيانات"}
                            </ModalHeader>
                            <ModalBody>
                                {!dataOverview ? (
                                    <ExportSelectionForm
                                        onSubmit={handlePreview}
                                        isLoading={isLoading}
                                        onCancel={handleClose}
                                    />
                                ) : (
                                    <ExportPreview
                                        dataOverview={dataOverview}
                                        onConfirm={handleConfirmExport}
                                        onCancel={handleClose}
                                    />
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ExportBtn;
