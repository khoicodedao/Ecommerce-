import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductCard from "@/components/product-card";
import type { Category, Product } from "@shared/schema";

export default function CollectionsPage() {
  const { slug } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || '';
  
  const [sortBy, setSortBy] = useState("newest");
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", slug],
    enabled: !!slug,
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/categoryId=" + (category?.id || '') + "&search=" + searchQuery],
    enabled: !!category?.id || !!searchQuery,
  });

  const priceRanges = [
    { label: "Dưới 50,000₫", value: "0-50000" },
    { label: "50,000₫ - 100,000₫", value: "50000-100000" },
    { label: "100,000₫ - 200,000₫", value: "100000-200000" },
    { label: "Trên 200,000₫", value: "200000-999999999" },
  ];

  const productTypes = [
    { label: "Streaming", value: "streaming" },
    { label: "Gaming", value: "gaming" },
    { label: "Music", value: "music" },
    { label: "Productivity", value: "productivity" },
    { label: "Design", value: "design" },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá thấp đến cao", value: "price-asc" },
    { label: "Giá cao đến thấp", value: "price-desc" },
    { label: "Đánh giá cao nhất", value: "rating" },
  ];

  const filteredProducts = products?.filter(product => {
    // Price filter
    if (priceFilter.length > 0) {
      const price = parseFloat(product.salePrice || product.price);
      const matchesPrice = priceFilter.some(range => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && price <= max;
      });
      if (!matchesPrice) return false;
    }

    // Type filter
    if (typeFilter.length > 0) {
      const matchesType = typeFilter.some(type => 
        product.tags?.includes(type) ||
        product.name.toLowerCase().includes(type) ||
        product.description.toLowerCase().includes(type)
      );
      if (!matchesType) return false;
    }

    return true;
  });

  const sortedProducts = filteredProducts?.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price);
      case "price-desc":
        return parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      default:
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-slate-800 text-lg">Bộ lọc</h3>
      
      {/* Price Filter */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3">Khoảng giá</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${range.value}`}
                checked={priceFilter.includes(range.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPriceFilter([...priceFilter, range.value]);
                  } else {
                    setPriceFilter(priceFilter.filter(p => p !== range.value));
                  }
                }}
              />
              <label htmlFor={`price-${range.value}`} className="text-sm cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3">Loại sản phẩm</h4>
        <div className="space-y-2">
          {productTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={typeFilter.includes(type.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTypeFilter([...typeFilter, type.value]);
                  } else {
                    setTypeFilter(typeFilter.filter(t => t !== type.value));
                  }
                }}
              />
              <label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li><a href="/" className="text-blue-600 hover:text-blue-500">Trang chủ</a></li>
          <li className="text-slate-400">/</li>
          <li className="text-slate-600">{category?.name || "Tìm kiếm"}</li>
          {searchQuery && (
            <>
              <li className="text-slate-400">/</li>
              <li className="text-slate-600">"{searchQuery}"</li>
            </>
          )}
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : category?.name}
        </h1>
        {category?.description && (
          <p className="text-slate-600">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <FilterSidebar />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              Hiển thị {sortedProducts?.length || 0} sản phẩm
            </p>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-slate-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                      <div className="h-8 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-slate-600">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts && sortedProducts.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button size="sm" className="bg-blue-600">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
