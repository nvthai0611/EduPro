"use client"
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, Target } from "lucide-react"

const About = () => {

  const navigate = useNavigate();


  const journeySteps = [
    {
      step: "01",
      title: "Chọn khóa học phù hợp",
      description: "Khám phá danh mục khóa học đa dạng từ cơ bản đến nâng cao. Đội ngũ tư vấn sẽ giúp bạn lựa chọn lộ trình học tập phù hợp với mục tiêu và nền tảng của bạn",
    },
    {
      step: "02",
      title: "Đăng ký & Bắt đầu học",
      description: "Đăng ký dễ dàng chỉ trong vài bước. Truy cập ngay vào nền tảng học tập hiện đại với tài liệu đầy đủ và bài giảng chất lượng cao",
    },
    {
      step: "03",
      title: "Học tập & Thực hành",
      description: "Học theo tiến độ linh hoạt với video bài giảng, bài tập thực hành và dự án thực tế. Được hỗ trợ 24/7 từ giảng viên và cộng đồng học viên",
    },
    {
      step: "04",
      title: "Nhận chứng chỉ & Phát triển",
      description: "Hoàn thành khóa học và nhận chứng chỉ được công nhận. Tiếp tục phát triển sự nghiệp với sự hỗ trợ việc làm và cập nhật kiến thức liên tục",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="EduPro Learning Platform"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Về Chúng Tôi</div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6 leading-tight">
                  Học lập trình tại
                  <br />
                  <span className="text-blue-600">EduPro</span>
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  EduPro là nền tảng học lập trình mang đến cho bạn cơ hội tiếp cận với các khóa học 
                  chất lượng cao từ cơ bản đến nâng cao. Chúng tôi cam kết giúp bạn phát triển kỹ năng lập trình và 
                  thăng tiến trong sự nghiệp.
                </p>

                <p>
                  Với đội ngũ giảng viên giàu kinh nghiệm và phương pháp giảng dạy hiện đại, chúng tôi tạo ra một môi 
                  trường học tập tích cực và hiệu quả. Mỗi khóa học được thiết kế kỹ lưỡng với nội dung cập nhật và 
                  bài tập thực hành phong phú.
                </p>

                <p>
                  Tại EduPro, chúng tôi tin rằng việc học lập trình không chỉ là học code, mà còn là phát triển tư duy 
                  logic, giải quyết vấn đề và sáng tạo. Đó là lý do chúng tôi xây dựng các khóa học toàn diện, kết hợp 
                  lý thuyết vững chắc với thực hành dự án thực tế.
                </p>
              </div>

              <div className="pt-4">
                <div className="w-16 h-px bg-blue-400 mb-4"></div>
                <p className="text-sm text-gray-500 italic">&quot; Thứ khiến ta đánh mất giấc mơ nhiều hơn đó là sự do dự, hơn là thất bại <br /> Vậy nên còn chần chờ gì nữa!!! &quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Trải Nghiệm Học Tập</div>
            <h3 className="text-4xl font-light text-slate-800 mb-4">Phương pháp học hiệu quả</h3>
            <div className="w-16 h-px bg-blue-400 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Khóa học chất lượng */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Khóa học chất lượng cao"
                  className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              <h4 className="text-2xl font-light text-slate-800 mb-4">Khóa học chất lượng</h4>
              <div className="w-16 h-px bg-blue-400 mx-auto mb-4"></div>

              <p className="text-gray-600 leading-relaxed">
                Nội dung khóa học được cập nhật liên tục theo xu hướng công nghệ mới nhất. Video bài giảng Full HD, 
                tài liệu đầy đủ và bài tập thực hành phong phú giúp bạn nắm vững kiến thức.
              </p>
            </div>

            {/* Giảng viên giàu kinh nghiệm */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Giảng viên chuyên nghiệp"
                  className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              <h4 className="text-2xl font-light text-slate-800 mb-4">Giảng viên chuyên nghiệp</h4>
              <div className="w-16 h-px bg-blue-400 mx-auto mb-4"></div>

              <p className="text-gray-600 leading-relaxed">
                Đội ngũ giảng viên  có nhiều năm kinh nghiệm thực tế tại các công ty công nghệ. 
                Họ không chỉ dạy lý thuyết mà còn chia sẻ kinh nghiệm thực tế quý báu.
              </p>
            </div>

            {/* Hỗ trợ 24/7 */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hỗ trợ học viên"
                  className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              <h4 className="text-2xl font-light text-slate-800 mb-4">Hỗ trợ 24/7</h4>
              <div className="w-16 h-px bg-blue-400 mx-auto mb-4"></div>

              <p className="text-gray-600 leading-relaxed">
                Cộng đồng học viên sôi động và đội ngũ mentor luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi. 
                Giải đáp thắc mắc nhanh chóng, review code và hướng dẫn chi tiết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Hành Trình Học Tập</div>
            <h3 className="text-4xl font-light text-slate-800 mb-4">4 bước để trở thành lập trình viên</h3>
            <div className="w-16 h-px bg-blue-400 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 mr-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow pt-2">
                  <h4 className="text-2xl font-semibold text-slate-800 mb-3">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Triết Lý Giáo Dục</div>
            <h3 className="text-4xl font-light text-slate-800 mb-8">Phát triển toàn diện kỹ năng lập trình</h3>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Học không giới hạn</h4>
                <p className="text-gray-600 leading-relaxed">
                  Truy cập trọn đời tất cả khóa học đã đăng ký. Học mọi lúc mọi nơi với tốc độ phù hợp với bạn
                </p>
              </div>

              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Thực hành thực tế</h4>
                <p className="text-gray-600 leading-relaxed">
                  Làm việc với dự án thực tế, xây dựng portfolio ấn tượng để sẵn sàng cho thị trường việc làm
                </p>
              </div>

              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Chứng chỉ công nhận</h4>
                <p className="text-gray-600 leading-relaxed">
                  Nhận chứng chỉ hoàn thành khóa học được các doanh nghiệp công nhận và đánh giá cao
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-4xl font-light mb-6">Sẵn sàng bắt đầu hành trình của bạn?</h3>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Tham gia cùng hàng chục nghìn học viên đang học tập và phát triển tại EduPro
        </p>
        <button
          onClick={() => {
            navigate("/courses");
            window.scrollTo(0, 0);
          }}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg"
        >
          Khám phá khóa học ngay
        </button>
      </div>
    </section>
    </div>
  )
}

export default About 