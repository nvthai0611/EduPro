import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import image1 from "../../assets/images/image.png";
import image2 from "../../assets/images/image2.png";
import image3 from "../../assets/images/image3.jpg";

import { initAOS } from "../../lib/aos-init";

const slides = [
  {
    id: 1,
    title: "ĐƯA THỂ THAO VIỆT NAM",
    subtitle: "VƯƠN TẦM THẾ GIỚI",
    signature: "SpaConnect SPA",
    description: "NHÀ VÔ ĐỊCH BÓNG ĐÁ NGHỆ THUẬT CHÂU Á",
    image: image1,
  },
  {
    id: 2,
    title: "TỎA SÁNG PHONG CÁCH",
    subtitle: "TỰ TIN THÀNH CÔNG",
    signature: "SpaConnect SHOP",
    description: "DỊCH VỤ LÀM ĐẸP CHUYÊN NGHIỆP HÀNG ĐẦU",
    image: image2,
  },
  {
    id: 3,
    title: "PHONG CÁCH MỚI",
    subtitle: "CUỘC SỐNG MỚI",
    signature: "SpaConnect SIGNATURE",
    description: "TRẢI NGHIỆM DỊCH VỤ 5 SAO",
    image: image3,
  },
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // dùng chuột được luôn
  });
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);
  useEffect(() => {
    initAOS();
  }, []);
  return (
    <div
      data-aos="fade-down"
      data-aos-offset="100"
      data-aos-delay="200"
      data-aos-duration="500"
      data-aos-once="true"
      {...handlers}
      className="relative mx-auto w-full max-w-7xl h-100 overflow-hidden rounded-lg "
    >
      <div
        className="flex transition-transform duration-400 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full flex-shrink-0">
            <div className="relative h-[250px] md:h-[400px] w-full bg-blue-800">
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-blue-900/40"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <div className="mb-2 text-sm md:text-base font-light flex items-center">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt="HaeiShop"
                    className="h-6 w-auto mr-2"
                  />
                  <span className="opacity-90">×</span>
                  <span className="ml-2">{slide.signature}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                  {slide.title}
                </h2>
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  {slide.subtitle}
                </h1>
                <div className="mt-4 text-sm md:text-base opacity-80">
                  {slide.description}
                </div>
                <div className="mt-8 border-t border-white/30 w-48 pt-2">
                  <span className="text-xl italic font-signature">
                    {slide.signature}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white w-auto h-auto"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white w-auto h-auto"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
