import { PenSquare } from "lucide-react";
import { Link } from "react-router-dom";

const WritePostButton = () => {
  return (
    <>
      {/* Desktop Version */}
      <Link
        to="/forum/create"
        className="hidden md:flex fixed bottom-24 right-8 z-50 items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <PenSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-medium">Viết bài</span>
      </Link>

      {/* Mobile Version */}
      <Link
        to="/forum/create"
        className="md:hidden fixed bottom-[140px] right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Viết bài mới"
      >
        <PenSquare className="w-6 h-6" />
      </Link>
    </>
  );
};

export default WritePostButton;
