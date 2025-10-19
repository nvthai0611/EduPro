const StaffFooter = () => {
  return (
    <footer className="bg-white border-t">
      <div className="px-6 py-4">
        <p className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Spa Booking System - Staff Portal
        </p>
      </div>
    </footer>
  );
};

export default StaffFooter;
