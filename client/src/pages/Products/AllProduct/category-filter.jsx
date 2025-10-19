"use client"

import { Button } from "@/components/ui/button"

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange("all")}
        className={selectedCategory === "all" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50"}
      >
        Tất cả
      </Button>
      {categories.map((category) => (
        <Button
          key={category._id}
          variant={selectedCategory === category._id ? "default" : "outline"}
          onClick={() => onCategoryChange(category._id)}
          className={selectedCategory === category._id ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50"}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
