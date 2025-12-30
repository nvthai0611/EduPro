import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle } from "lucide-react";

export default function Advisory({ plans = [] }) {
  if (!plans.length) {
    return (
      <div className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg text-center">
        <GraduationCap className="mx-auto mb-4 text-blue-600" size={40} />
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          Tư vấn lộ trình học tập
        </h3>
        <p className="text-gray-600">
          Hiện chưa có lộ trình phù hợp.  
          <br />Vui lòng quay lại sau hoặc liên hệ để được tư vấn cá nhân.
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-8 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
          <GraduationCap className="text-blue-600" size={28} />
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900">
          Tư vấn lộ trình học tập
        </h3>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Lộ trình được thiết kế bài bản, cá nhân hóa theo mục tiêu và năng lực của bạn
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.id}
            className="group relative p-6 rounded-2xl border bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition"
          >

            <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
              {p.title}
            </h4>

            <p className="text-sm text-gray-600 mb-4">
              {p.description}
            </p>

            {/* Steps */}
            <ul className="space-y-2">
              {p.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-green-500 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            {/* Action */}
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                Nhận tư vấn chi tiết
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA bottom */}
      <div className="mt-12 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          Liên hệ tư vấn 1:1
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}