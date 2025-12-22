import { Search, X, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../../../hooks/useCourseQueries";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch courses with TanStack Query
  const { data: courses = [], isLoading } = useCourses(
    {
      ...(debouncedQuery.trim() && { search: debouncedQuery }),
      status: "published" // Always filter published courses
    },
    {
      enabled: debouncedQuery.trim().length > 0,
      select: (data) => {
        if (!Array.isArray(data)) return [];
        // Filter courses by search query (client-side if needed)
        return data.filter(course => 
          course.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      }
    }
  );

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = courses.length > 0;

  const ResultSection = ({ title, items, Icon, type }) => {
    if (items.length === 0) return null;

    return (
      <div className="py-2">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">{title}</h3>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Xem thêm
          </button>
        </div>
        <div className="space-y-1">
          {items.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              to={type === 'course' ? `/courses/${item.slug}` : `/${type}s/${item.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {item.image || item.thumbnail ? (
                <img 
                  src={item.image || item.thumbnail} 
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  type === 'course' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    type === 'course' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
              )}
              <span className="text-sm text-gray-700 line-clamp-2 flex-1">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Tìm kiếm khóa học, bài viết, video..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Dropdown Results */}
          {isOpen && searchQuery && debouncedQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 mt-2">Đang tìm kiếm...</p>
                </div>
              ) : hasResults ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Search className="w-4 h-4" />
                      <span>Kết quả cho "<span className="font-semibold text-gray-800">{searchQuery}</span>"</span>
                    </div>
                  </div>

                  <ResultSection 
                    title="KHÓA HỌC" 
                    items={courses} 
                    Icon={BookOpen}
                    type="course"
                  />
                  
            
                  
                </>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Không tìm thấy kết quả cho "<span className="font-semibold">{searchQuery}</span>"</p>
                  <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden w-full px-3 py-2" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Dropdown Results */}
          {isOpen && searchQuery && debouncedQuery && (
            <div className="absolute top-full left-3 right-3 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[60vh] overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500 mt-2">Đang tìm kiếm...</p>
                </div>
              ) : hasResults ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Search className="w-3 h-3" />
                      <span>Kết quả cho '<span className="font-semibold text-gray-800">{searchQuery}</span>'</span>
                    </div>
                  </div>

                  <ResultSection 
                    title="KHÓA HỌC" 
                    items={courses} 
                    Icon={BookOpen}
                    type="course"
                  />
                </>
              ) : (
                <div className="p-6 text-center">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Không tìm thấy kết quả</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
