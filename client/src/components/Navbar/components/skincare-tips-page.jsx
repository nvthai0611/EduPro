"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Clock, User, Eye, Heart, Share2, Bookmark } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const tipsData = [
  {
    id: 1,
    title: "10 Bước Chăm Sóc Da Mặt Hàng Ngày",
    excerpt: "Hướng dẫn chi tiết quy trình chăm sóc da mặt từ cơ bản đến nâng cao cho làn da khỏe mạnh",
    content: `
      <h3>Quy trình chăm sóc da buổi sáng:</h3>
      <ol>
        <li>Rửa mặt với sữa rửa mặt nhẹ nhàng</li>
        <li>Sử dụng toner để cân bằng pH</li>
        <li>Thoa serum vitamin C</li>
        <li>Dưỡng ẩm phù hợp với loại da</li>
        <li>Chống nắng SPF 30 trở lên</li>
      </ol>
      
      <h3>Quy trình chăm sóc da buổi tối:</h3>
      <ol>
        <li>Tẩy trang kỹ lưỡng</li>
        <li>Rửa mặt sạch sẽ</li>
        <li>Toner dưỡng ẩm</li>
        <li>Serum phục hồi da ban đêm</li>
        <li>Kem dưỡng đêm giàu dưỡng chất</li>
      </ol>
    `,
    category: "Chăm sóc cơ bản",
    author: "Chuyên gia Lan Anh",
    readTime: "5 phút",
    publishDate: "2024-01-15",
    views: 1250,
    likes: 89,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Chăm sóc da", "Quy trình", "Hàng ngày"],
  },
  {
    id: 2,
    title: "Cách Chọn Kem Chống Nắng Phù Hợp",
    excerpt: "Bí quyết lựa chọn kem chống nắng hiệu quả cho từng loại da và hoạt động",
    content: `
      <h3>Các loại kem chống nắng:</h3>
      <ul>
        <li><strong>Physical Sunscreen:</strong> Chứa zinc oxide, titanium dioxide - phù hợp da nhạy cảm</li>
        <li><strong>Chemical Sunscreen:</strong> Hấp thụ tia UV - thích hợp cho da thường</li>
        <li><strong>Hybrid Sunscreen:</strong> Kết hợp cả hai loại trên</li>
      </ul>
      
      <h3>Cách chọn theo loại da:</h3>
      <ul>
        <li><strong>Da khô:</strong> Chọn loại có dưỡng ẩm cao</li>
        <li><strong>Da dầu:</strong> Chọn dạng gel, không gây bóng nhờn</li>
        <li><strong>Da nhạy cảm:</strong> Ưu tiên physical sunscreen</li>
      </ul>
    `,
    category: "Chống nắng",
    author: "BS. Minh Hương",
    readTime: "4 phút",
    publishDate: "2024-01-12",
    views: 980,
    likes: 67,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Chống nắng", "Lựa chọn sản phẩm", "Loại da"],
  },
  {
    id: 3,
    title: "Điều Trị Mụn Tại Nhà Hiệu Quả",
    excerpt: "Phương pháp điều trị mụn an toàn và hiệu quả ngay tại nhà với nguyên liệu tự nhiên",
    content: `
      <h3>Nguyên nhân gây mụn:</h3>
      <ul>
        <li>Tắc nghẽn lỗ chân lông</li>
        <li>Vi khuẩn P.acnes phát triển</li>
        <li>Rối loạn hormone</li>
        <li>Stress và chế độ ăn uống</li>
      </ul>
      
      <h3>Cách điều trị tại nhà:</h3>
      <ol>
        <li>Rửa mặt 2 lần/ngày với sữa rửa mặt chứa salicylic acid</li>
        <li>Sử dụng toner không cồn</li>
        <li>Thoa điểm trị mụn chứa benzoyl peroxide</li>
        <li>Dưỡng ẩm không gây mụn</li>
        <li>Chống nắng hàng ngày</li>
      </ol>
    `,
    category: "Điều trị mụn",
    author: "Chuyên gia Thu Hà",
    readTime: "6 phút",
    publishDate: "2024-01-10",
    views: 1450,
    likes: 112,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Điều trị mụn", "Tại nhà", "Tự nhiên"],
  },
  {
    id: 4,
    title: "Massage Mặt Chống Lão Hóa",
    excerpt: "Kỹ thuật massage mặt đơn giản giúp tăng cường tuần hoàn máu và chống lão hóa",
    content: `
      <h3>Lợi ích của massage mặt:</h3>
      <ul>
        <li>Tăng cường tuần hoàn máu</li>
        <li>Giảm căng thẳng cơ mặt</li>
        <li>Kích thích sản sinh collagen</li>
        <li>Giảm nếp nhăn và chảy xệ</li>
      </ul>
      
      <h3>Các bước massage cơ bản:</h3>
      <ol>
        <li>Làm sạch tay và mặt</li>
        <li>Thoa dầu massage hoặc serum</li>
        <li>Massage từ trong ra ngoài, từ dưới lên trên</li>
        <li>Tập trung vào vùng mắt và miệng</li>
        <li>Kết thúc bằng những cú vuốt nhẹ nhàng</li>
      </ol>
    `,
    category: "Chống lão hóa",
    author: "Chuyên gia Phương Linh",
    readTime: "7 phút",
    publishDate: "2024-01-08",
    views: 890,
    likes: 78,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Massage", "Chống lão hóa", "Tự làm"],
  },
]

export default function SkincareTipsPage() {
  const [tips, setTips] = useState(tipsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [likedTips, setLikedTips] = useState([])
  const [bookmarkedTips, setBookmarkedTips] = useState([])

  const categories = ["all", "Chăm sóc cơ bản", "Chống nắng", "Điều trị mụn", "Chống lão hóa"]

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleLike = (tipId) => {
    if (likedTips.includes(tipId)) {
      setLikedTips(likedTips.filter((id) => id !== tipId))
    } else {
      setLikedTips([...likedTips, tipId])
      toast.success("Đã thích bài viết!")
    }
  }

  const toggleBookmark = (tipId) => {
    if (bookmarkedTips.includes(tipId)) {
      setBookmarkedTips(bookmarkedTips.filter((id) => id !== tipId))
      toast.success("Đã bỏ lưu bài viết!")
    } else {
      setBookmarkedTips([...bookmarkedTips, tipId])
      toast.success("Đã lưu bài viết!")
    }
  }

  const shareArticle = (title) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "Bí kíp chăm sóc da từ SpaConnect",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Đã sao chép link bài viết!")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">📖 Bí Kíp Chăm Sóc Da</CardTitle>
          <CardDescription className="text-green-100">
            Khám phá những bí quyết chăm sóc da từ các chuyên gia hàng đầu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bí kíp chăm sóc da..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  {category === "all" ? "Tất cả" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTips.map((tip, index) => (
          <Card
            key={tip.id}
            className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative">
              <img
                src={tip.image || "/placeholder.svg"}
                alt={tip.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-100 text-blue-800">{tip.category}</Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleBookmark(tip.id)}
                  className={`bg-white/80 backdrop-blur-sm h-8 w-8 p-0 rounded-full ${
                    bookmarkedTips.includes(tip.id) ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedTips.includes(tip.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{tip.excerpt}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tip.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{tip.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tip.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{tip.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{tip.likes + (likedTips.includes(tip.id) ? 1 : 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Đọc Thêm
                      </Button>
                    </DialogTrigger>
                    <DialogContent describedby="" className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{tip.title}</DialogTitle>
                        <DialogDescription>
                          Bởi {tip.author} • {tip.readTime} đọc •{" "}
                          {new Date(tip.publishDate).toLocaleDateString("vi-VN")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img
                          src={tip.image || "/placeholder.svg"}
                          alt={tip.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: tip.content }} />
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            {tip.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleLike(tip.id)}
                              className={likedTips.includes(tip.id) ? "text-red-500" : "text-gray-500"}
                            >
                              <Heart className={`w-4 h-4 mr-1 ${likedTips.includes(tip.id) ? "fill-current" : ""}`} />
                              {tip.likes + (likedTips.includes(tip.id) ? 1 : 0)}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => shareArticle(tip.title)}>
                              <Share2 className="w-4 h-4 mr-1" />
                              Chia sẻ
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleLike(tip.id)}
                    className={`${likedTips.includes(tip.id) ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
                  >
                    <Heart className={`w-4 h-4 ${likedTips.includes(tip.id) ? "fill-current" : ""}`} />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => shareArticle(tip.title)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                  Xuất bản: {new Date(tip.publishDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-100 p-6 rounded-full">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600">Không tìm thấy bài viết</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc danh mục để xem thêm bài viết</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
