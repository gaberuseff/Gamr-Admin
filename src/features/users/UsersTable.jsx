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
    useDisclosure,
    useDraggable
} from "@heroui/react";
import { useCallback, useRef, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { HiNoSymbol } from "react-icons/hi2";
import Center from "../../ui/Center";
import useUpdateUser from "./useUpdateUser";
import useUsers from "./useUsers";
import useDeleteUser from "./useDeleteUser";

export const columns = [
    { name: "الاسم", uid: "name" },
    { name: "البريد الإلكتروني", uid: "email" },
    { name: "الهاتف", uid: "phone" },
    { name: "الدور", uid: "role" },
    { name: "الحالة", uid: "is_blocked" },
    { name: "الإجراءات", uid: "actions" },
];

function UsersTable() {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const targetRef = useRef(null);
    const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

    const { users, isUsersLoading } = useUsers()
    const { updateUser, isUpdatingUser } = useUpdateUser()
    const { deleteUser, deletePending } = useDeleteUser()

    const handleUpdateUser = (userId, action) => {
        updateUser({ userId, action })
    }

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        onOpen();
    };

    const handleConfirmDelete = () => {
        if (selectedUserId) {
            deleteUser(selectedUserId, {
                onSuccess: () => {
                    onOpenChange(false);
                }
            });
        }
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{cellValue || "غير محدد"}</p>
                    </div>
                );
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm">{cellValue || "غير محدد"}</p>
                    </div>
                );
            case "phone":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm">{cellValue || "غير محدد"}</p>
                    </div>
                );
            case "is_blocked":
                return (
                    <div className="flex flex-col">
                        <Chip
                            className="capitalize"
                            color={user.is_blocked ? "danger" : "success"}
                            size="sm"
                            variant="flat"
                        >
                            {user.is_blocked ? "محظور" : "نشط"}
                        </Chip>
                    </div>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <Chip
                            className="capitalize"
                            color={cellValue === "admin" ? "primary" : "default"}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue || "user"}
                        </Chip>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-2 ">
                        <Tooltip content="Edit user">
                            {user.is_blocked ? <Button color="success"
                                variant="bordered" size="sm" endContent={<HiNoSymbol />}
                                onPress={() => handleUpdateUser(user.id, "unblock")}
                                isLoading={isUpdatingUser}>
                                unblock
                            </Button> : <Button color="danger" variant="bordered" size="sm" endContent={<HiNoSymbol />}
                                onPress={() => handleUpdateUser(user.id, "block")}
                                isLoading={isUpdatingUser}>
                                block
                            </Button>}
                        </Tooltip>

                        <Tooltip color="danger" content="Delete user">
                            <Button isIconOnly variant="bordered" color="danger" size="sm"
                                onPress={() => handleDeleteClick(user.id)}>
                                <HiTrash />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [handleUpdateUser]);

    if (isUsersLoading) return <Center>
        <Spinner size="lg" />
    </Center>

    return (
        <div className="flex flex-col gap-4">
            <Table aria-label="Users table" shadow="none">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users}>
                    {(user) => (
                        <TableRow key={user.id}>
                            {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal حذف المستخدم */}
            <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader {...moveProps} className="flex flex-col gap-1">
                                حذف المستخدم
                            </ModalHeader>
                            <ModalBody>
                                <p>هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    إلغاء
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleConfirmDelete}
                                    isLoading={deletePending}
                                >
                                    حذف
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UsersTable
