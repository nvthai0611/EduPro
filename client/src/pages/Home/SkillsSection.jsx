import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SkillsSection() {
  const skills = [
    "Nền tảng kỹ thuật lập trình vững chắc",
    "Nâng cao kỹ năng giải quyết bài toán",
    "Làm quen với các cấu trúc dữ liệu & giải thuật quan trọng",
    "Nâng cao tư duy logic trong lập trình"
  ];

  return (
    <section className="py-20 bg-[#F5FAFF]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGES */}
        <div className="relative flex flex-col gap-6">
          <img
            src="https://img.freepik.com/free-vector/happy-women-learning-language-online-isolated-flat-vector-illustration-cartoon-female-characters-taking-individual-lessons-through-messenger-education-digital-technology-concept_74855-10088.jpg?t=st=1764757053~exp=1764760653~hmac=c41f277fffdd5fa1da33a2f9d72fbef743ab91d36cb69de9f03aa4d111a0958c&w=1480"
            className="w-[420px] rounded-xl shadow-lg"
            alt=""
          />
          <img
            src="https://img.freepik.com/free-vector/student-graduation-cap-using-computer-desk_1262-21421.jpg?t=st=1764757135~exp=1764760735~hmac=bead603dfc5caa79263af33f1ac5e6ea96dfa7e6e1b678e62e67094ebea15036&w=1480"
            className="w-[360px] rounded-xl shadow-lg ml-auto"
            alt=""
          />
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h2 className="text-4xl font-bold text-[#0A2E5C] leading-snug">
            Những kỹ năng mà khóa học đem lại cho học viên
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            EduPro là đội ngũ lập trình viên xuất sắc trong ngành với nhiều năm kinh nghiệm thực chiến,
            mang đến khóa học chất lượng cao và phù hợp với mọi trình độ của học viên.
          </p>

          <div className="mt-8 space-y-5">
            {skills.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>

          <Link to="/courses">
            <Button className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
              Xem các khóa học
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
