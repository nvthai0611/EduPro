import { Card, CardContent } from '@/components/ui/card';

// Skeleton component for stats section
export const StatsSkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="text-center space-y-4">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse max-w-16 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse max-w-20 mx-auto"></div>
      </div>
    ))}
  </div>
);

// Skeleton component for categories section
export const CategoriesSkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded max-w-24 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded max-w-20 mx-auto"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Skeleton component for testimonials section
export const TestimonialsSkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-white/20 rounded max-w-32"></div>
              <div className="h-3 bg-white/20 rounded max-w-24"></div>
            </div>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="w-4 h-4 bg-white/20 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded"></div>
            <div className="h-3 bg-white/20 rounded max-w-4/5"></div>
            <div className="h-3 bg-white/20 rounded max-w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Complete home page skeleton
export const HomePageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Section Skeleton */}
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
          <div className="h-6 bg-white/20 rounded animate-pulse mx-auto max-w-3xl"></div>
          <div className="h-6 bg-white/20 rounded animate-pulse mx-auto max-w-xl"></div>
          <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto max-w-48"></div>
        </div>
      </div>
    </div>

    {/* Stats Section Skeleton */}
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsSkeletonLoader />
      </div>
    </div>

    {/* Categories Section Skeleton */}
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse max-w-md mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse max-w-lg mx-auto"></div>
        </div>
        <CategoriesSkeletonLoader />
      </div>
    </div>
  </div>
);