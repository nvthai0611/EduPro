import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
// import "@/styles/carousel.css" 

export function Carousel({ children, options }) {
  const [emblaRef] = useEmblaCarousel(options)

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">{children}</div>
    </div>
  )
}

export function CarouselItem({ children, className }) {
  return <div className={`min-w-full ${className}`}>{children}</div>
}
