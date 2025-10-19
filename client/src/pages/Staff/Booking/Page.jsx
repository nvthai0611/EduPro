import { ToastContainer } from "react-toastify";
import BookingPage from "./BookingPage";

export const metadata = {
  title: "Booking",
  description: "Booking",
};

export default function PageBooking() {
  return (
    <div className="w-full">
      <ToastContainer />
      <BookingPage />
    </div>
  );
}
