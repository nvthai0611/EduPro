import ManageProduct from "./ManageProduct";
import { ToastContainer } from "react-toastify";

export const metadata = {
    title: "Quản lý sản phẩm",
    description: "Quản lý sản phẩm, và cập nhật thông tin sản phẩm",
};

export default function PageProductManagement() {
    return (
        <div className="w-full p-4">
            <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>
            <ManageProduct />
            <ToastContainer />
        </div>
    );
} 