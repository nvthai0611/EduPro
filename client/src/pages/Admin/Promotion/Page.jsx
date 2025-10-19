import { ToastContainer } from "react-toastify";
import PromotionManagement from "./PromotionManagement";
export const metadata = {
  title: "Quản lý Promotion",
  description: "Quản lý Promotion, và cập nhật thông tin Promotion",
};

export default function PagePromotionManagement() {
  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý Promotion</h1>
      <PromotionManagement />
      <ToastContainer />
    </div>
  );
}
