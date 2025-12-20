import UserManagement from "./ManageUser"

export const metadata = {
    title: "User Management Dashboard",
    description: "Manage user accounts, roles, and permissions",
}

export default function PageUserManagement() {
    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-2">Quản lý các tài khoản của học viên</p>
            <UserManagement />
        </div>
    )
}
