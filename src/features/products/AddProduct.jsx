import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@heroui/react";

import { useState } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import useCreateProduct from "./useCreateProduct";
import ImageUploader from "./ImageUploader";
import { uploadMultipleProductImages } from "../../services/apiStorage";
import toast from "react-hot-toast";

function AddProduct() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [sizes, setSizes] = useState([{ size: "", price: "" }]);
    const [inStock, setInStock] = useState(true);
    const [images, setImages] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { createProduct, isCreatingProduct } = useCreateProduct();

    const handleAddSize = () => {
        setSizes([...sizes, { size: "", price: "" }]);
    };

    const handleRemoveSize = (index) => {
        if (sizes.length > 1) {
            setSizes(sizes.filter((_, i) => i !== index));
        }
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        data.sizes = sizes.map(s => ({
            size: s.size,
            price: Number(s.price)
        }));
        data.in_stock = inStock;
        data.discount = Number(data.discount) || 0;

        // رفع الصور أولاً
        if (images.length > 0) {
            try {
                setIsUploadingImages(true);
                const imageUrls = await uploadMultipleProductImages(images, data.name_en);
                data.images = imageUrls;
            } catch (error) {
                console.error('Error uploading images:', error);
                toast.error('فشل رفع الصور');
                setIsUploadingImages(false);
                return;
            } finally {
                setIsUploadingImages(false);
            }
        } else {
            data.images = [];
        }

        createProduct(data, {
            onSuccess: () => {
                handleReset();
                onOpenChange(false);
            }
        });
    };

    const handleReset = () => {
        setSizes([{ size: "", price: "" }]);
        setInStock(true);
        setImages([]);
    };

    return (
        <>
            <div className="flex justify-start mb-6">
                <Button color="primary" startContent={<HiOutlinePlus />} onClick={onOpen}>
                    إضافة منتج جديد
                </Button>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">إضافة منتج جديد</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4"
                                    onReset={handleReset}
                                    onSubmit={handleSubmit}
                                >
                                    <div className="flex gap-4 w-full">
                                        <Input
                                            isRequired
                                            errorMessage="الاسم باللغة العربية"
                                            labelPlacement="inside"
                                            name="name_ar"
                                            placeholder="الاسم باللغة العربية"
                                            type="text"
                                            autoComplete="off"
                                        />

                                        <Input
                                            isRequired
                                            errorMessage="الاسم باللغة الإنجليزية"
                                            labelPlacement="inside"
                                            name="name_en"
                                            placeholder="الاسم باللغة الإنجليزية"
                                            type="text"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="flex gap-4 w-full">
                                        <Textarea
                                            isRequired
                                            errorMessage="الوصف باللغة العربية"
                                            labelPlacement="inside"
                                            name="description_ar"
                                            placeholder="الوصف باللغة العربية"
                                            autoComplete="off"
                                        />

                                        <Textarea
                                            isRequired
                                            errorMessage="الوصف باللغة الإنجليزية"
                                            labelPlacement="inside"
                                            name="description_en"
                                            placeholder="الوصف باللغة الإنجليزية"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="flex gap-4 w-full items-center">
                                        <Input
                                            errorMessage="الخصم"
                                            labelPlacement="inside"
                                            name="discount"
                                            placeholder="الخصم"
                                            defaultValue={0}
                                            type="number"
                                            autoComplete="off"
                                        />

                                        <Checkbox
                                            isSelected={inStock}
                                            onValueChange={setInStock}
                                            name="in_stock"
                                        >
                                            فى المخزون؟
                                        </Checkbox>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium">الأحجام والأسعار</label>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                variant="flat"
                                                startContent={<HiOutlinePlus />}
                                                onClick={handleAddSize}
                                                type="button"
                                            >
                                                إضافة حجم
                                            </Button>
                                        </div>

                                        {sizes.map((sizeItem, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <Input
                                                    isRequired
                                                    placeholder="الحجم (مثال: 50ml)"
                                                    value={sizeItem.size}
                                                    onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                                                    className="flex-1"
                                                    autoComplete="off"
                                                />
                                                <Input
                                                    isRequired
                                                    placeholder="السعر"
                                                    type="number"
                                                    value={sizeItem.price}
                                                    onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                                                    className="flex-1"
                                                    autoComplete="off"
                                                />
                                                {sizes.length > 1 && (
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="flat"
                                                        onClick={() => handleRemoveSize(index)}
                                                        type="button"
                                                    >
                                                        <HiOutlineTrash />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* رفع الصور */}
                                    <div className="w-full">
                                        <ImageUploader images={images} setImages={setImages} />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            color="primary"
                                            type="submit"
                                            isLoading={isCreatingProduct || isUploadingImages}
                                        >
                                            {isUploadingImages ? "جاري رفع الصور..." : "حفظ"}
                                        </Button>
                                        <Button type="reset" variant="flat">
                                            إعادة تعيين
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    إلغاء
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddProduct