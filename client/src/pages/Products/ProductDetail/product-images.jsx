"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductImages({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  // Ensure images is an array before proceeding
  const validImages = Array.isArray(images) && images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      {/* Main Image with Carousel */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="aspect-square bg-white rounded-lg border overflow-hidden">
          <img
            src={validImages[selectedImage]}
            alt={productName || "Name Product"}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Carousel Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
        {validImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-white rounded-lg border overflow-hidden transition-all ${selectedImage === index ? "ring-2 ring-blue-600 border-blue-600" : "hover:border-gray-300 hover:shadow-sm"
              }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Carousel Dots Indicator */}
      {validImages.length > 1 && (
        <div className="flex justify-center space-x-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}