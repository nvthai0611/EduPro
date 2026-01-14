import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

const HeroSection = ({ featuredPosts = [] }) => {
  if (!featuredPosts || featuredPosts.length === 0) return null;

  const mainPost = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 4);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
        {/* Main Featured Post - Takes 2 columns */}
        {mainPost && (
          <Link
            to={`/forum/${mainPost.slug}`}
            className="lg:col-span-2 group relative overflow-hidden rounded-xl bg-gray-900"
          >
            <img
              src={mainPost.thumbnail || "https://via.placeholder.com/800x500"}
              alt={mainPost.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
              {mainPost.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600 rounded-full mb-3">
                  {mainPost.category}
                </span>
              )}
              <h2 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {mainPost.title}
              </h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {mainPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <img
                    src={mainPost.author?.avatar || "https://i.pravatar.cc/40"}
                    alt={mainPost.author?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{mainPost.author?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mainPost.readTime || "5"} phút đọc</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{mainPost.views || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Side Posts - 3 smaller cards */}
        <div className="flex flex-col gap-4">
          {sidePosts.map((post, index) => (
            <Link
              key={post._id || index}
              to={`/forum/${post.slug}`}
              className="group relative overflow-hidden rounded-xl bg-gray-900 h-full"
            >
              <img
                src={post.thumbnail || "https://via.placeholder.com/400x300"}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {post.category && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-600 rounded-full mb-2">
                    {post.category}
                  </span>
                )}
                <h3 className="text-sm lg:text-base font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
