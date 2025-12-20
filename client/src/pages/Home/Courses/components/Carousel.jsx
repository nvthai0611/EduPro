import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Percent,
  Bell,
  Sparkles,
} from "lucide-react";

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      emblaApi && emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const banners = [
    {
      id: 1,
      title: "GIẢM GIÁ ĐẶC BIỆT",
      subtitle: "Giảm đến 50% cho tất cả khóa học",
      description: "Áp dụng cho học viên mới đăng ký trong tháng này",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      icon: Percent,
    },
    {
      id: 2,
      title: "CẬP NHẬT HỆ THỐNG",
      subtitle: "Giao diện mới - Trải nghiệm tốt hơn",
      description: "Hệ thống học tập được nâng cấp với nhiều tính năng mới",
      gradient: "from-blue-500 via-purple-500 to-indigo-500",
      icon: Bell,
    },
    {
      id: 3,
      title: "KHÓA HỌC MỚI",
      subtitle: "Khám phá kiến thức mới mỗi ngày",
      description: "Hàng trăm khóa học chất lượng cao đang chờ bạn",
      gradient: "from-green-500 via-teal-500 to-cyan-500",
      icon: Sparkles,
    },
  ];

  return (
    <div className="relative w-full px-4 py-8">
      <div className="relative max-w-7xl mx-auto">
        <div ref={emblaRef} className="overflow-hidden rounded-3xl">
          <div className="flex">
            {banners.map((banner) => (
              <div key={banner.id} className="flex-[0_0_100%] min-w-0 px-2">
                {/* SLIDE */}
                <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                  {/* IMAGE BACKGROUND (BLUR) */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQspEpYG7xA60kaNNTB5IoNVeWNB7nzRgT3gw&s"
                    alt=""
                    className="absolute right-0 top-0 h-full w-[55%] object-cover blur-[1px] scale-110 opacity-50"
                  />

                  {/* GRADIENT OVERLAY */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} from-0% via-60% to-transparent`}/>

                  {/* CONTENT */}
                  <div className="relative z-10 h-full flex items-center px-16">
                    <div className="text-white max-w-xl">
                      <h4 className="text-sm font-black tracking-widest mb-3">
                        {banner.title}
                      </h4>
                      <h2 className="text-3xl font-bold mb-4">
                        {banner.subtitle}
                      </h2>
                      <p className="text-white/90">{banner.description}</p>

                      <button
                        className="
                        mt-8
                        bg-white text-black
                        px-8 py-3
                        rounded-full
                        font-bold
                        hover:scale-105
                        transition
                        shadow-lg
                      "
                      >
                        Tìm hiểu ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NAV BUTTONS */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl z-20"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl z-20"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* DOTS */}
        <div className="flex justify-center mt-6 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-blue-600 w-10 h-3"
                  : "bg-gray-300 w-3 h-3"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
