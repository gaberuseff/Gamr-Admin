import { Button, Form, Input, Modal, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import useCreateUser from "./useCreateUser";

import {
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@heroui/react";

function AddUserForm() {
    const [action, setAction] = useState(null);
    const { createUser, isCreatingUser } = useCreateUser();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const usersTypes = [
        { key: "admin", label: "مدير" },
        { key: "employee", label: "موظف" },
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
        createUser(data, {
            onSuccess: () => {
                onOpenChange();
            }
        });
    }

    return (
        <>
            <div>
                <Button color="primary" onPress={onOpen}>إضافة مستخدم جديد</Button>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full max-w-2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">إضافة مستخدم جديد</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full grid grid-cols-2 gap-4"
                                    onReset={() => setAction("reset")}
                                    onSubmit={handleSubmit}
                                >
                                    <Input
                                        isRequired
                                        errorMessage="الاسم مطلوب"
                                        label="الاسم"
                                        labelPlacement="outside"
                                        name="name"
                                        placeholder="الاسم"
                                        type="text"
                                    />

                                    <Input
                                        isRequired
                                        errorMessage="الايميل مطلوب"
                                        label="الايميل"
                                        labelPlacement="outside"
                                        name="email"
                                        placeholder="الايميل"
                                        type="text"
                                    />

                                    <Input
                                        isRequired
                                        errorMessage="رقم الهاتف مطلوب"
                                        label="رقم الهاتف"
                                        labelPlacement="outside"
                                        name="phone"
                                        placeholder="رقم الهاتف"
                                        type="text"
                                    />

                                    <Input
                                        isRequired
                                        errorMessage="كلمة المرور مطلوبة"
                                        label="كلمة المرور"
                                        labelPlacement="outside"
                                        name="password"
                                        placeholder="كلمة المرور"
                                        type="password"
                                    />

                                    <Select label="نوع المستخدم"
                                        disableSelectorIconRotation
                                        labelPlacement="outside"
                                        placeholder="نوع المستخدم"
                                        name="role"
                                        isRequired
                                        className="col-span-2"
                                    >
                                        {usersTypes.map((userType) => (
                                            <SelectItem key={userType.key}>{userType.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-2 col-span-2">
                                        <Button color="primary" type="submit" isLoading={isCreatingUser}>
                                            اضافة مستخدم
                                        </Button>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            إلغاء
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>

    )
}

export default AddUserForm
