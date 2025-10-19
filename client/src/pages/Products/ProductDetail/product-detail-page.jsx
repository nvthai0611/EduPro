"use client"

import { useState, useEffect } from "react"
import ProductImages from "./product-images"
import ProductInfo from "./product-info"
import ReviewsSection from "./reviews-section"
import RelatedProducts from "./related-products"
import { getAllReviewsProduct, getProductById, getRelatedProductByCategory } from "../../../services/commonService"
import { useParams } from "react-router-dom"
import { CartProvider } from "../../../pages/Cart/CartItem/context/CartContext"

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const { id } = useParams() // Assuming you're using a router that provides useParams
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      const resDataProduct = await getProductById(id)
      const resDataReviews = await getAllReviewsProduct(id)
      const resDataRelatedProducts = await getRelatedProductByCategory(id)
      if (resDataProduct.success) {
        setProduct(resDataProduct.data)
      }
      if (resDataReviews.success) {
        setReviews(resDataReviews.data)
      }

      if (resDataRelatedProducts.success) {
        setRelatedProducts(resDataRelatedProducts.data)
      }
    }
    setTimeout(() => {
      // setProduct(fakeProduct)
      // setReviews(fakeReviews)
      setLoading(false)
    }, 1000)
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600">
                Trang chủ
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/shop" className="hover:text-blue-600">
                Shop
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product?.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ProductImages images={product?.images} productName={product?.name} />
          <ProductInfo product={product} reviews={reviews} />
        </div>

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} />

        {/* Related Products Section */}
        <RelatedProducts products={relatedProducts} currentProductId={product?._id} />
      </main>

      {/* Footer */}

    </div>

  )
}
