import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Percent, Bell, Sparkles } from 'lucide-react';

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center'
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi) return;

    // const interval = setInterval(() => {
    //   emblaApi.scrollNext();
    // }, 5000);

    // return () => clearInterval(interval);
  }, [emblaApi]);

  const banners = [
    {
      id: 1,
      title: "GIẢM GIÁ ĐẶC BIỆT",
      subtitle: "Giảm đến 50% cho tất cả khóa học",
      description: "Áp dụng cho học viên mới đăng ký trong tháng này",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      icon: Percent
    },
    {
      id: 2,
      title: "CẬP NHẬT HỆ THỐNG",
      subtitle: "Giao diện mới - Trải nghiệm tốt hơn",
      description: "Hệ thống học tập được nâng cấp với nhiều tính năng mới",
      gradient: "from-blue-500 via-purple-500 to-indigo-500",
      icon: Bell
    },
    {
      id: 3,
      title: "KHÓA HỌC MỚI",
      subtitle: "Khám phá kiến thức mới mỗi ngày",
      description: "Hàng trăm khóa học chất lượng cao đang chờ bạn",
      gradient: "from-green-500 via-teal-500 to-cyan-500",
      icon: Sparkles
    }
  ];

  return (
    <div className="relative w-full px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
          <div className="flex">
            {banners.map((banner) => {
              const Icon = banner.icon;
              return (
                <div key={banner.id} className="flex-[0_0_100%] min-w-0 px-2">
                  <div className={`relative h-80 bg-gradient-to-r ${banner.gradient} rounded-3xl overflow-hidden shadow-2xl`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-between px-16">
                      <div className="text-white max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          {/* <Icon className="w-12 h-12" /> */}
                          <h4 className=" font-black tracking-tight">{banner.title}</h4>
                        </div>
                        <h5 className=" font-bold mb-4">{banner.subtitle}</h5>
                        <p className="text-white/90">{banner.description}</p>
                        <button className="mt-8 bg-clip-content text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                          Tìm hiểu ngay
                        </button>
                      </div>
                      
                      {/* Icon decoration */}
                      <div className="hidden lg:block">
                        <Icon className="w-64 h-64 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 rounded-full ${
                index === selectedIndex
                  ? 'bg-blue-600 w-12 h-3'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;