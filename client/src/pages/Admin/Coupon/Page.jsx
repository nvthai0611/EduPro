import CouponsManagement from "./CouponManagement";

export const metadata = {
  title: "Quản lý Coupon",
  description: "Quản lý Coupon",
};

export default function PageCouponsManagement() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Quản lý Coupon</h1>
      <CouponsManagement />
    </div>
  );
}
