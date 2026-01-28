import UserDataForm from "../features/auth/UserDataForm"
import UserUpdatePassFrom from "../features/auth/UserUpdatePassFrom"

function Profile() {
    return (
        <div className="flex lg:flex-row flex-col gap-4 w-full">
            <UserDataForm />
            <UserUpdatePassFrom />
        </div>
    )
}

export default Profile
