import Dashboard from "./Dashboard";

export const metadata = {
  title: "Staff Dashboard",
  description: "Dashboard cho nhân viên chi nhánh",
};

export default function PageDashboard() {
  return (
    <div className="w-full">
      <Dashboard />
    </div>
  );
}
