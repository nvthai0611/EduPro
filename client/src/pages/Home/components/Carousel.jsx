import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "../../../../hooks/useBanners";

const GRADIENT_COLORS = [
  "from-blue-500 via-blue-600 to-blue-700",
  "from-purple-500 via-purple-600 to-purple-700",
  "from-pink-500 via-pink-600 to-pink-700",
  "from-green-500 via-green-600 to-green-700",
  "from-yellow-500 via-yellow-600 to-yellow-700",
  "from-red-500 via-red-600 to-red-700",
  "from-indigo-500 via-indigo-600 to-indigo-700",
  "from-teal-500 via-teal-600 to-teal-700",
  "from-orange-500 via-orange-600 to-orange-700",
  "from-cyan-500 via-cyan-600 to-cyan-700",
];

const AUTOPLAY_DELAY = 5000;

const Carousel = () => {
  const autoplayRef = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 25,
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    data: banners = [],
    isLoading,
    isError,
  } = useBanners({
    location: "home_carousel",
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  // Embla setup
  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  const randomGradient = useMemo(() => {
    return GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="z-40 w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !banners || banners.length === 0) {
    return (
      <div className="z-40 w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="relative max-w-7xl mx-auto">
          <div
            className={`h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${randomGradient} flex items-center justify-center text-white`}
          >
            <p className="text-lg font-semibold">
              Không có banner nào để hiển thị
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="z-40 w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="relative max-w-7xl mx-auto group">
        {/* Main Carousel Container */}
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="flex">
            {banners.map((banner, idx) => {
              const gradientColor =
                banner.color || GRADIENT_COLORS[idx % GRADIENT_COLORS.length];

              return (
                <div
                  key={banner.id}
                  className="flex-[0_0_100%] min-w-0 px-1 sm:px-2"
                >
                  {/* SLIDE */}
                  <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    {/* IMAGE BACKGROUND WITH PARALLAX EFFECT */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        className="absolute right-0 top-0 h-full w-full sm:w-[60%] object-cover transform transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Dark overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* GRADIENT OVERLAY */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${gradientColor} opacity-95`}
                      style={{
                        background: `linear-gradient(to right, 
                          var(--tw-gradient-stops), 
                          transparent 70%)`,
                      }}
                    />

                    {/* ANIMATED PATTERN OVERLAY */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
                      <div className="text-white max-w-xl space-y-2 sm:space-y-3 md:space-y-4 animate-fade-in">
                        {/* Badge/Tag */}
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                          {/* <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> */}
                          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                            {banner.title}
                          </span>
                        </div>

                        {/* Main Title */}
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                          {banner.description}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-md leading-relaxed hidden sm:block">
                          {banner.subtitle ||
                            "Khám phá khóa học chất lượng cao với giá ưu đãi"}
                        </p>

                        {/* CTA Button */}
                        <button
                          className="
                            mt-3 sm:mt-4
                            inline-flex items-center gap-1
                            bg-white text-gray-900
                            px-4 sm:px-5 md:px-6 
                            py-2 sm:py-2.5
                            rounded-full
                            text-xs sm:text-sm
                            font-semibold
                            transition-all duration-200
                            hover:scale-105 hover:shadow-lg
                            active:scale-95
                          "
                          aria-label={`Tìm hiểu về ${banner.title}`}
                        >
                          Tìm hiểu ngay
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <button
          onClick={scrollPrev}
          className="
    absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 
    bg-white/90 hover:bg-white backdrop-blur-sm
    rounded-full p-1.5 sm:p-2
    shadow-lg hover:shadow-xl
    transition-all duration-300
    opacity-0 group-hover:opacity-100
    hover:scale-105 active:scale-95
    z-20
    focus:outline-none focus:ring-2 focus:ring-white/50
  "
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
        </button>
        <button
          onClick={scrollNext}
          className="
    absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 
    bg-white/90 hover:bg-white backdrop-blur-sm
    rounded-full p-1.5 sm:p-2
    shadow-lg hover:shadow-xl
    transition-all duration-300
    opacity-0 group-hover:opacity-100
    hover:scale-105 active:scale-95
    z-20
    focus:outline-none focus:ring-2 focus:ring-white/50
  "
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
        </button>

        {/* DOTS */}
        <div className="flex justify-center items-center mt-4 sm:mt-5 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`
                rounded-full transition-all duration-200
                ${
                  index === selectedIndex
                    ? "bg-gray-800 w-6 h-2"
                    : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
