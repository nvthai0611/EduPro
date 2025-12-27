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
    <div className="z-40 w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="relative max-w-7xl mx-auto">
        <div ref={emblaRef} className="overflow-hidden rounded-2xl sm:rounded-3xl">
          <div className="flex">
            {banners.map((banner) => (
              <div key={banner.id} className="flex-[0_0_100%] min-w-0 px-1 sm:px-2">
                {/* SLIDE */}
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl">
                  {/* IMAGE BACKGROUND (BLUR) */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQspEpYG7xA60kaNNTB5IoNVeWNB7nzRgT3gw&s"
                    alt=""
                    className="absolute right-0 top-0 h-full w-[50%] sm:w-[55%] object-cover blur-[1px] scale-110 opacity-50"
                  />

                  {/* GRADIENT OVERLAY */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} from-0% via-60% to-transparent`}/>

                  {/* CONTENT */}
                  <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
                    <div className="text-white max-w-xl">
                      <h4 className="text-xs sm:text-sm font-black tracking-widest mb-2 sm:mb-3">
                        {banner.title}
                      </h4>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">
                        {banner.subtitle}
                      </h2>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base hidden sm:block">{banner.description}</p>

                      <button
                        className="
                        mt-4 sm:mt-6 md:mt-8
                        bg-white text-black
                        px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3
                        rounded-full
                        text-xs sm:text-sm md:text-base
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

        {/* NAV BUTTONS - Hidden on mobile */}
        <button
          onClick={scrollPrev}
          className="hidden sm:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl z-20"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
        </button>

        <button
          onClick={scrollNext}
          className="hidden sm:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl z-20"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
        </button>

        {/* DOTS */}
        <div className="flex justify-center mt-3 sm:mt-4 md:mt-6 gap-2 sm:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-black w-3 sm:w-4 h-2.5 sm:h-3"
                  : "bg-gray-300 w-2.5 sm:w-3 h-2.5 sm:h-3"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
