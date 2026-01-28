import { Button } from "@heroui/react";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import useLogout from "./useLogout";

function Logout() {
    const { logout, isLogoutPending } = useLogout();

    return (
        <Button isIconOnly aria-label="Like" color="primary" variant="flat"
            size="md"
            isLoading={isLogoutPending}
            onPress={logout}>
            <HiArrowLeftStartOnRectangle size={20} />
        </Button>
    )
}

export default Logout
