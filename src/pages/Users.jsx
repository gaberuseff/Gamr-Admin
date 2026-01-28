import AddUserForm from "../features/users/AddUserForm"
import UsersTable from "../features/users/UsersTable"

function Users() {
    return (
        <div className="flex flex-col gap-4">
            <UsersTable />
            <AddUserForm />
        </div>
    )
}

export default Users
