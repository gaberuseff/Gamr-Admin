import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function EditableImageUploader({
    existingImages = [],
    newImages,
    setNewImages,
    deletedImages,
    setDeletedImages
}) {
    const [newPreviews, setNewPreviews] = useState([]);

    // إنشاء معاينات للصور الجديدة
    useEffect(() => {
        if (newImages.length === 0) {
            setNewPreviews([]);
            return;
        }

        const previews = [];
        newImages.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === newImages.length) {
                    setNewPreviews([...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [newImages]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    };

    const addImages = (files) => {
        // فلترة الصور فقط
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        // حساب العدد الكلي للصور
        const totalImages = existingImages.length - deletedImages.length + newImages.length;

        // التحقق من الحد الأقصى
        if (totalImages + imageFiles.length > MAX_IMAGES) {
            alert(`يمكنك رفع ${MAX_IMAGES} صور كحد أقصى`);
            return;
        }

        // التحقق من حجم الملفات
        const validFiles = imageFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                alert(`الصورة ${file.name} أكبر من 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // إضافة الصور الجديدة
        setNewImages([...newImages, ...validFiles]);
    };

    const removeExistingImage = (imageUrl) => {
        setDeletedImages([...deletedImages, imageUrl]);
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewPreviews(newPreviews.filter((_, i) => i !== index));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // الصور الموجودة التي لم يتم حذفها
    const visibleExistingImages = existingImages.filter(
        img => !deletedImages.includes(img)
    );

    const totalVisibleImages = visibleExistingImages.length + newImages.length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">صور المنتج</label>
                <span className="text-xs text-gray-500">
                    {totalVisibleImages} / {MAX_IMAGES} صور
                </span>
            </div>

            {/* منطقة رفع الصور */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => document.getElementById('edit-image-input').click()}
            >
                <HiOutlinePhotograph className="mx-auto text-3xl text-gray-400 mb-1" />
                <p className="text-sm text-gray-600 mb-1">اضغط لاختيار الصور أو اسحبها هنا</p>
                <p className="text-xs text-gray-400">حد أقصى {MAX_IMAGES} صور، كل صورة حتى 5MB</p>
                <input
                    id="edit-image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* معاينة الصور */}
            {totalVisibleImages > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {/* الصور الموجودة */}
                    {visibleExistingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative group">
                            <img
                                src={imageUrl}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingImage(imageUrl)}
                                type="button"
                            >
                                <HiOutlineX />
                            </Button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                موجودة
                            </div>
                        </div>
                    ))}

                    {/* الصور الجديدة */}
                    {newPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                            <img
                                src={preview}
                                alt={`New ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNewImage(index)}
                                type="button"
                            >
                                <HiOutlineX />
                            </Button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {(newImages[index].size / 1024).toFixed(0)} KB
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EditableImageUploader;
