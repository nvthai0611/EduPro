"use client"

import { useState, useMemo, useEffect } from "react"
import CategoryFilter from "./category-filter"
import SearchAndSort from "./search-and-sort"
import ActiveFilters from "./active-filters"
import FilterSidebar from "./filter-sidebar"
import ProductGrid from "./product-grid"
import ReviewModal from "./review-modal"
import { getAllProduct, getAllProductCategories, getAllReviews, getAllReviewsProduct } from "../../../services/commonService"


export default function ProductListing() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [maxPriceProduct, setMaxPriceProduct] = useState(0)
  const [isLoading, setIsLoading] = useState(true) // Thêm state loading
  const [error, setError] = useState(null) // Thêm state error
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const responseDataProduct = await getAllProduct()
        const getAllProductCategory = await getAllProductCategories()
        const getAllReviewProduct = await getAllReviews()
        if (responseDataProduct?.success) {
          setProducts(responseDataProduct?.data)
        } else {
          setError("Không thể tải danh sách sản phẩm")
        }

        if (getAllProductCategory?.success) {
          setCategories(getAllProductCategory?.data)
        }

        if (getAllReviewProduct?.success) {
          setReviews(getAllReviewProduct?.data)
        }

      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu")
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = products.reduce((max, product) => Math.max(max, product.price), 0)
      setMaxPriceProduct(maxPrice)
      setPriceRange([0, maxPrice]) // Cập nhật giá trị mặc định của priceRange
    }
  }, [products])



  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      selectedCategory !== "all" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== maxPriceProduct ||
      minPrice !== "" ||
      maxPrice !== ""
    )
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm !== "") count++
    if (selectedCategory !== "all") count++
    if (priceRange[0] !== 0 || priceRange[1] !== maxPriceProduct || minPrice !== "" || maxPrice !== "") count++
    return count
  }

  const filteredProducts = useMemo(() => {
    const filtered = products?.filter((product) => {
      const matchesSearch =
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product?.category?._id === selectedCategory

      const minPriceValue = minPrice !== "" ? Number?.parseFloat(minPrice) : priceRange[0]
      const maxPriceValue = maxPrice !== "" ? Number?.parseFloat(maxPrice) : priceRange[1]
      const matchesPrice = product.price >= minPriceValue && product?.price <= maxPriceValue
      return matchesSearch && matchesCategory && matchesPrice && product?.status
    })

    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a?.price - b?.price
        case "price-high":
          return b?.price - a?.price
        case "rating":
          return b?.rating - a?.rating
        case "name":
          return a?.name?.localeCompare(b?.name)
        case "all":
          return null;
        default:
          return null;
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, priceRange, minPrice, maxPrice, products])

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }
  console.log("filteredProducts", filteredProducts);

  const totalPages = Math?.ceil(filteredProducts?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts?.slice(startIndex, startIndex + itemsPerPage)

  const resetPagination = () => setCurrentPage(1)

  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat?._id === categoryId)
    return category ? category?.name : "Unknown"
  }

  const getProductReviews = (productId) => {
    return reviews.filter((review) => review?.product?._id === productId)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange([0, maxPriceProduct])
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
    setSortBy("name")
  }

  const handleViewReviews = (product) => {
    setSelectedProduct(product)
    setShowReviewModal(true)
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value)
    setMinPrice("")
    setMaxPrice("")
    resetPagination()
  }

  const handleMinPriceChange = (value) => {
    setMinPrice(value)
    resetPagination()
  }

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value)
    resetPagination()
  }

  const handleClearPriceFilter = () => {
    setMinPrice("")
    setMaxPrice("")
    setPriceRange([0, maxPriceProduct])
    resetPagination()
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Category Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Spa Services & Treatments</h1>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <SearchAndSort
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <ActiveFilters
            hasActiveFilters={hasActiveFilters()}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            onClearSearch={() => {
              setSearchTerm("")
              resetPagination()
            }}
            onClearCategory={() => {
              setSelectedCategory("all")
              resetPagination()
            }}
            onClearPrice={() => {
              setPriceRange([0, maxPriceProduct])
              setMinPrice("")
              setMaxPrice("")
              resetPagination()
            }}
            onClearAll={clearAllFilters}
            getActiveFiltersCount={getActiveFiltersCount}
            maxPriceProduct={maxPriceProduct}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onClearPriceFilter={handleClearPriceFilter}
            categories={categories}
            products={products}
            maxPriceProduct={maxPriceProduct}
          />

          <ProductGrid
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            hasActiveFilters={hasActiveFilters()}
            getCategoryName={getCategoryName}
            onViewReviews={handleViewReviews}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            onClearFilters={clearAllFilters}
          />
        </div>
      </div>

      {/* <ReviewModal
        product={selectedProduct}
        reviews={selectedProduct ? getProductReviews(selectedProduct._id) : []}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      /> */}
    </div>
  )
}