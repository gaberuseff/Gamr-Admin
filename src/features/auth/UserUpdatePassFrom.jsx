import { Button, Card, Form, Input } from "@heroui/react";
import { useState } from "react";
import useUpdatePassword from "./useUpdatePassword";

function UserUpdatePassFrom() {
    const [action, setAction] = useState(null);

    const { updatePassword, isUpdatingPassword } = useUpdatePassword();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        updatePassword(formData, {
            onSuccess: () => {
                setAction("reset");
            }
        });
    }

    return (
        <Card className="w-full flex flex-col gap-4 px-4 py-12" shadow="none">
            <Form
                className="w-full max-w-sm flex flex-col gap-4"
                onReset={() => setAction("reset")}
                onSubmit={handleSubmit}>
                <Input
                    isRequired
                    errorMessage="كلمة المرور الحالية"
                    label="كلمة المرور الحالية"
                    labelPlacement="outside"
                    name="currentPassword"
                    placeholder="أدخل كلمة المرور الحالية"
                    type="password"
                />

                <Input
                    isRequired
                    errorMessage="كلمة المرور الجديدة"
                    label="كلمة المرور الجديدة"
                    labelPlacement="outside"
                    name="newPassword"
                    placeholder="أدخل كلمة المرور الجديدة"
                    type="password"
                />

                <Input
                    isRequired
                    errorMessage="تأكيد كلمة المرور الجديدة"
                    label="تأكيد كلمة المرور الجديدة"
                    labelPlacement="outside"
                    name="confirmNewPassword"
                    placeholder="أدخل تأكيد كلمة المرور الجديدة"
                    type="password"
                />

                <div className="flex gap-2">
                    <Button color="primary" type="submit" isLoading={isUpdatingPassword}>
                        حفظ التغييرات
                    </Button>
                </div>
            </ Form >
        </Card>
    )
}

export default UserUpdatePassFrom
