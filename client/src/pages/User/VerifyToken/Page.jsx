import VerifyToken from "./VerifyToken";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Verify Token",
  description: "Verify Token",
};

export default function PageVerifyToken() {
  return (
    <div className="w-full">
      <VerifyToken />
      <ToastContainer />
    </div>
  );
}
