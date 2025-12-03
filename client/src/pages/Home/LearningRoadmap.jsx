import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const roadmap = [
  {
    title: "Giai đoạn 1: Nền tảng",
    desc: "HTML, CSS, JavaScript, Git, UI/UX cơ bản.",
  },
  {
    title: "Giai đoạn 2: Frontend",
    desc: "ReactJS, TailwindCSS, API, tối ưu hiệu năng.",
  },
  {
    title: "Giai đoạn 3: Backend",
    desc: "NodeJS, Express, MongoDB / MySQL.",
  },
  {
    title: "Giai đoạn 4: Triển khai",
    desc: "Docker, CI/CD, triển khai thực tế.",
  },
  {
    title: "Giai đoạn 5: Dự án thực chiến",
    desc: "Xây dựng dự án hoàn chỉnh + luyện phỏng vấn.",
  },
];

export default function LearningRoadmap() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Lộ Trình Học <span className="text-blue-600">Từ A → Z</span>
        </h2>

        <div className="space-y-8 relative">
          {/* line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[3px] bg-blue-300/50 md:transform md:-translate-x-1/2" />

          {roadmap.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center gap-6 relative"
            >
              {/* icon */}
              <div className="z-10">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle size={22} />
                </div>
              </div>

              {/* card */}
              <Card className="flex-1 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">{step.desc}</CardContent>
              </Card>

              {index !== roadmap.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
