import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Pencil,
  Loader2,
  Copy,
} from "lucide-react";
import {
  getAllProducts,
  changeProductStatus,
  getAllProductCategories,
} from "../../../services/admin/productService";
import { formatPrice } from "../../../utils/format";
import ProductDetailDialog from "./ProductDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductDialog from "./ProductDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCTS_PER_PAGE = 10;

export default function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogCreateUpdateOpen, setDialogCreateUpdateOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res?.data || []);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter((product) => {
        if (
          statusFilter !== "all" &&
          product.status.toString() !== statusFilter
        ) {
          return false;
        }
        if (
          categoryFilter !== "all" &&
          product.category?._id !== categoryFilter
        ) {
          return false;
        }
        const matchesSearch =
          product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortDirection === "asc"
            ? a?.name.localeCompare(b.name)
            : b?.name.localeCompare(a.name);
        } else if (sortField === "price") {
          return sortDirection === "asc"
            ? a?.price - b?.price
            : b?.price - a?.price;
        }
        return 0;
      });
    return filtered;
  }, [
    products,
    searchTerm,
    sortField,
    sortDirection,
    statusFilter,
    categoryFilter,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleStatus = async (product) => {
    setStatusLoading(product._id);
    try {
      await changeProductStatus(product._id, !product.status);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, status: !p.status } : p
        )
      );
    } catch (e) {
      // handle error
    } finally {
      setStatusLoading("");
    }
  };
  const fetchCategories = async () => {
    const categories = await getAllProductCategories();
    setCategories(categories.data || []);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setDialogCreateUpdateOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogCreateUpdateOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseDialog = () => {
    setDialogCreateUpdateOpen(false);
    setSelectedProduct(null);
  };

  const handleDuplicateProduct = (product) => {
    const duplicateData = {
      ...product,
      name: `${product.name} (copy)`,
      _id: null,
      images: [],
    };
    setSelectedProduct(duplicateData);
    setDialogCreateUpdateOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <div className="flex gap-2 w-fit">
            {/* filter theo trạng thái */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue value={statusFilter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái </SelectItem>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              {/* filter theo category */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue value={categoryFilter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="gap-2">
              <Button
                className="gap-2"
                onClick={() => {
                  handleAddProduct();
                }}
              >
                <Plus className="h-4 w-4" />
                <p className="">Thêm sản phẩm mới</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[200px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Tên sản phẩm{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Giá{" "}
                {sortField === "price" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead>Giá sale</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    Đang tải...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.category?.name || (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {product.salePrice ? (
                      formatPrice(product.salePrice)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.stock ?? <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell>
                    {product.status ? (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleViewDetail(product);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditProduct(product);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleDuplicateProduct(product);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Tạo bản sao
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(product)}
                          disabled={statusLoading === product._id}
                          className={
                            product.status ? "text-red-600" : "text-green-600"
                          }
                        >
                          {statusLoading === product._id ? (
                            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                          ) : product.status ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị <strong>{paginatedProducts.length}</strong> /{" "}
          <strong>{filteredProducts.length}</strong> sản phẩm
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      </div>
      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onClose={() => {
          handleCloseDetail();
        }}
      />
      <ProductDialog
        product={selectedProduct}
        open={dialogCreateUpdateOpen}
        onClose={() => {
          handleCloseDialog();
        }}
        onSuccess={fetchProducts}
        categories={categories}
      />
    </div>
  );
}
