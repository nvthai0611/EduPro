/* eslint-disable react/prop-types */
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "./ProductCard";
import { useState, useEffect, useRef } from "react"; // Import useRef

export default function ProductGrid({ products, onAddToCart }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const sliderContainerRef = useRef(null); // Create a ref for the slider container

  // Effect to check if all images are loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      setImagesLoaded(true); // If no products, consider images loaded
      return;
    }

    let loadedCount = 0;
    // We can't use products.length directly for totalImages if ProductCard
    // might render multiple images or no images. A more robust way is to
    // count the actual image elements.
    const images = sliderContainerRef.current ? sliderContainerRef.current.querySelectorAll('img') : [];
    const totalImages = images.length;

    if (totalImages === 0) {
      setImagesLoaded(true); // No images to load, so they're "loaded"
      return;
    }

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });

    // Cleanup listeners
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', checkAllLoaded);
        img.removeEventListener('error', checkAllLoaded);
      });
    };
  }, [products]); // Re-run if products change

  // Define the KeenSlider plugins
  // Only include the update plugin if images are loaded
  const plugins = [];
  if (imagesLoaded) {
    plugins.push((sliderInstance) => sliderInstance.update());
  }

  const [sliderRef, slider] = useKeenSlider(
    {
      loop: false,
      mode: "free-snap",
      slides: {
        perView: 1.5,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 3, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 5, spacing: 24 },
        },
        "(min-width: 1280px)": {
          slides: { perView: 5, spacing: 24 },
        },
      },
    },
    // Pass the conditionally constructed plugins array
    plugins
  );

  const showNavigation = products.length > 5;

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {showNavigation && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100 w-auto h-auto focus:outline-none"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100 w-auto h-auto focus:outline-none"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Carousel */}
      <div
        ref={(node) => {
          sliderRef(node); // Pass the node to KeenSlider's ref
          sliderContainerRef.current = node; // Also store it in our local ref
        }}
        className="keen-slider"
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-delay="300"
        data-aos-duration="1000"
        data-aos-once="true"
        style={{ opacity: imagesLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="keen-slider__slide bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}