import { User } from "@heroui/react";
import { Link } from "react-router-dom";
import useUser from "./useUser";

function UserAvatar() {
    const { user: { user_metadata: { avatar_url, name } } } = useUser();

    return (
        <Link to="/profile" className="cursor-pointer hover:opacity-80">
            <User
                avatarProps={{
                    src: avatar_url,
                }}
                name={name}
            />
        </Link>
    )
}

export default UserAvatar
