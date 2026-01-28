import { Button, Card, Form, Input } from "@heroui/react";
import { useState } from "react";
import { HiUser } from "react-icons/hi2";
import useUpdateUserData from "./useUpdateUserData";
import useUser from "./useUser";

function UserDataForm() {
    const [action, setAction] = useState();
    const { user } = useUser();

    const { updateUser, isUpdating } = useUpdateUserData();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const avatarFile = formData.get('avatar');

        await updateUser({
            name,
            avatarFile: avatarFile?.size > 0 ? avatarFile : null
        });
    };

    return (
        <Card className="w-full flex flex-col gap-4 px-4 py-12" shadow="none">
            <Form
                className="w-full max-w-sm flex flex-col gap-4"
                onReset={() => setAction("reset")}
                onSubmit={handleSubmit}
            >
                <Input
                    isRequired
                    label="الاسم"
                    labelPlacement="outside"
                    name="name"
                    placeholder="أدخل اسمك"
                    type="text"
                    defaultValue={user?.user_metadata?.name}
                    isDisabled={isUpdating}
                />

                <Input
                    isRequired
                    label="البريد الالكتروني"
                    labelPlacement="outside"
                    name="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    type="email"
                    isReadOnly
                    value={user?.email}
                />

                {/* Avatar Upload Section */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        الصورة الشخصية
                    </label>

                    <div className="flex items-center gap-4">
                        {/* Image Preview */}
                        {(imagePreview || user?.user_metadata?.avatar_url) && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                                <img
                                    src={imagePreview || user?.user_metadata?.avatar_url}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Upload Button */}
                        <label htmlFor="avatar-upload" className="w-fit">
                            <Button
                                color="primary"
                                startContent={<HiUser />}
                                variant="bordered"
                                as="span"
                                className="cursor-pointer"
                                isDisabled={isUpdating}
                            >
                                اختر صورة
                            </Button>
                        </label>

                        <input
                            id="avatar-upload"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* File Information */}
                    {selectedImage && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                            <p className="font-medium">{selectedImage.name}</p>
                            <p className="text-gray-500">
                                {(selectedImage.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <Button color="primary" type="submit" isLoading={isUpdating}>
                        حفظ التغييرات
                    </Button>
                </div>
            </Form>
        </Card>
    )
}

export default UserDataForm
