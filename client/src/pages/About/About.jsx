"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"
import { getAverageRating } from '../../services/common/aboutService'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const About = () => {
  const aboutSectionRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const experienceRef = useRef(null)
  const journeyRef = useRef(null)
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    getAverageRating()
      .then(data => {
        setAverageRating(data.averageRating || 0)
        setReviewCount(data.count || 0)
      })
      .catch(() => {
        setAverageRating(0)
        setReviewCount(0)
      })

    // About section animations
    gsap.from(imageRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: aboutSectionRef.current,
        start: "top 80%",
      },
    })

    gsap.from(textRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: aboutSectionRef.current,
        start: "top 80%",
      },
    })

    // Experience section animations
    gsap.from(experienceRef.current?.children || [], {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: experienceRef.current,
        start: "top 80%",
      },
    })

    gsap.from(journeyRef.current?.children || [], {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: journeyRef.current,
        start: "top 90%",
      },
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const journeySteps = [
    {
      step: "01",
      title: "Tư vấn & Đánh giá",
      description: "Chuyên gia sẽ tư vấn và đánh giá tình trạng da, cơ thể để đưa ra liệu trình phù hợp nhất",
    },
    {
      step: "02",
      title: "Chuẩn bị & Thư giãn",
      description: "Thay đồ trong phòng riêng tư, thưởng thức trà thảo mộc và thư giãn trong không gian yên tĩnh",
    },
    {
      step: "03",
      title: "Trải nghiệm Liệu trình",
      description: "Tận hưởng liệu trình được cá nhân hóa với sự chăm sóc tận tâm từ therapist chuyên nghiệp",
    },
    {
      step: "04",
      title: "Nghỉ ngơi & Tư vấn",
      description: "Nghỉ ngơi sau liệu trình, nhận tư vấn chăm sóc tại nhà và lên lịch hẹn tiếp theo",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* About Section */}
      <section ref={aboutSectionRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div ref={imageRef} className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="SpaConnect Interior"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 shadow-2xl rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Customer Rating ({reviewCount})</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div ref={textRef} className="space-y-8">
              <div>
                <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">About Us</div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6 leading-tight">
                  Trải nghiệm spa
                  <br />
                  <span className="text-blue-600">đẳng cấp quốc tế</span>
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  SpaConnect là điểm đến lý tưởng cho những ai tìm kiếm sự cân bằng hoàn hảo giữa thư giãn và chăm sóc sắc
                  đẹp. Chúng tôi kết hợp tinh hoa của các liệu pháp truyền thống phương Đông với công nghệ hiện đại.
                </p>

                <p>
                  Không gian được thiết kế theo phong cách tối giản Nhật Bản, tạo ra một môi trường yên tĩnh và thanh
                  khiết. Mỗi chi tiết đều được chăm chút kỹ lưỡng để mang đến trải nghiệm thư giãn tuyệt đối.
                </p>

                <p>
                  Đội ngũ therapist chuyên nghiệp của chúng tôi được đào tạo bài bản về các kỹ thuật massage và chăm sóc
                  da tiên tiến, cam kết mang đến dịch vụ chất lượng cao nhất cho mỗi khách hàng.
                </p>

                <p>
                  Tại SpaConnect, chúng tôi tin rằng việc chăm sóc bản thân không chỉ là một dịch vụ mà còn là một hành
                  trình khám phá và nuôi dưỡng sự cân bằng giữa cơ thể, tâm trí và tinh thần.
                </p>
              </div>

              <div className="pt-4">
                <div className="w-16 h-px bg-blue-400 mb-4"></div>
                <p className="text-sm text-gray-500 italic">&quot;Nơi cơ thể và tâm hồn tìm thấy sự cân bằng hoàn hảo&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Our Experience</div>
            <h3 className="text-4xl font-light text-slate-800 mb-4">Trải nghiệm đẳng cấp</h3>
            <div className="w-16 h-px bg-blue-400 mx-auto"></div>
          </div>

          <div ref={experienceRef} className="grid lg:grid-cols-2 gap-12">
            {/* Không gian thư giãn */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src="https://easysalon.vn/wp-content/uploads/2020/09/hinh-anh-trang-tri-spa-2.jpg"
                  alt="SpaConnect Không gian thư giãn"
                  className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              <h4 className="text-3xl font-light text-slate-800 mb-6">Không gian thư giãn</h4>
              <div className="w-16 h-px bg-blue-400 mx-auto mb-6"></div>

              <p className="text-gray-600 leading-relaxed text-lg">
                Mỗi giác quan của bạn sẽ được chăm sóc và xoa dịu: âm thanh của nước chảy róc rách, hương thơm của tinh
                dầu thiên nhiên hay túi thảo dược ấm áp. Đôi mắt bạn sẽ đắm chìm trong không gian độc đáo, vị giác được
                thưởng thức trà thảo mộc ấm nóng và cơ thể được chăm sóc bởi những chuyên gia massage tài năng nhất...
                tất cả trong sự riêng tư và thoải mái của phòng trị liệu cá nhân.
              </p>
            </div>

            {/* Chuyên gia trị liệu */}
            <div className="text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Chuyên gia trị liệu SpaConnect"
                  className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              <h4 className="text-3xl font-light text-slate-800 mb-6">Chuyên gia trị liệu</h4>
              <div className="w-16 h-px bg-blue-400 mx-auto mb-6"></div>

              <p className="text-gray-600 leading-relaxed text-lg">
                Mỗi chuyên gia massage của chúng tôi đều được đào tạo chuyên nghiệp và có kinh nghiệm dày dặn. Sau khi
                hoàn thành khóa đào tạo lý thuyết và thực hành kéo dài 300 giờ, mỗi chuyên gia đều được cấp chứng chỉ
                bởi Bộ Y tế. Tất cả các liệu trình đều sử dụng kỹ thuật chuẩn hóa để đảm bảo chất lượng massage cao nhất
                với hiệu quả giảm stress được đảm bảo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Your Journey</div>
            <h3 className="text-4xl font-light text-slate-800 mb-4">Hành trình trải nghiệm tại SpaConnect</h3>
            <div className="w-16 h-px bg-blue-400 mx-auto"></div>
          </div>

          <div ref={journeyRef} className="max-w-4xl mx-auto">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 mr-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
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
            <div className="text-blue-600 text-sm tracking-[0.3em] uppercase font-medium mb-4">Our Philosophy</div>
            <h3 className="text-4xl font-light text-slate-800 mb-8">Triết lý chăm sóc toàn diện</h3>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Cân bằng</h4>
                <p className="text-gray-600 leading-relaxed">
                  Tạo sự hài hòa giữa cơ thể, tâm trí và tinh thần thông qua các liệu pháp chuyên sâu
                </p>
              </div>

              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Tái tạo</h4>
                <p className="text-gray-600 leading-relaxed">
                  Phục hồi năng lượng và sức sống tự nhiên bằng các phương pháp trị liệu hiện đại
                </p>
              </div>

              <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-medium text-slate-800 mb-3">Thăng hoa</h4>
                <p className="text-gray-600 leading-relaxed">
                  Nâng tầm trải nghiệm chăm sóc bản thân lên một đẳng cấp hoàn toàn mới
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
