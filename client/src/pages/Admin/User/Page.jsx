import UserManagement from "./ManageUser"

export const metadata = {
    title: "User Management Dashboard",
    description: "Manage user accounts, roles, and permissions",
}

export default function PageUserManagement() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Quản lý người dùng</h1>
            <UserManagement />
        </div>
    )
}
