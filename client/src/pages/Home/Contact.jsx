import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

export default function Contact() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F4F8FF]">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="
          relative overflow-hidden 
          rounded-2xl p-10 
          backdrop-blur-md 
          bg-white/50 
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ">
          
          {/* Light gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/50" />

          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-[#0A1A3C]">
              Đăng ký để nhận tư vấn miễn phí
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Để lại thông tin, đội ngũ EduPro sẽ liên hệ tư vấn trong thời gian sớm nhất.
            </p>
          </div>

          {/* FORM */}
          <form className="relative z-10 max-w-md mx-auto mt-10">
            <div className="relative">
              <Input
                className="
                  peer h-14 text-lg rounded-xl 
                  border-gray-300 focus:border-blue-500
                  focus:ring-blue-300 transition-all
                  bg-white/80 backdrop-blur-sm
                "
                required
                type="number"
                placeholder="Nhập số điện thoại của bạn..."
              />
            </div>

            <Button
              className="
                w-full mt-6 h-14 text-lg font-semibold
                rounded-xl flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-600 to-indigo-500 
                hover:from-blue-700 hover:to-indigo-600
                transition-all shadow-md hover:shadow-lg
              "
            >
              <Send className="w-5 h-5" />
              Gửi yêu cầu
            </Button>
          </form>

        </div>
      </div>
    </section>
  );
}