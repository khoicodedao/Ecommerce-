import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import type { Category, Product } from "@shared/schema";

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured=true&limit=4"],
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/limit=8"],
  });

  return (
    <div>
      {/* Hero Banners */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main banner */}
          <div className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-80 bg-gradient-to-r from-blue-600 to-blue-500">
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=320" 
                alt="Digital transformation banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-transparent"></div>
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white">
                <h1 className="text-4xl font-bold mb-4">Giải pháp số #1 Việt Nam</h1>
                <p className="text-xl mb-6 text-slate-100">Hơn 10,000+ sản phẩm digital chất lượng cao</p>
                <Button className="bg-white text-blue-600 hover:bg-slate-100">
                  Khám phá ngay
                </Button>
              </div>
            </div>
          </div>
          
          {/* Side banners */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden h-36 bg-gradient-to-br from-purple-600 to-blue-600">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=144" 
                alt="Gaming setup" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="font-semibold">Game Steam</p>
                  <p className="text-sm text-slate-200">Giảm 50%</p>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden h-36 bg-gradient-to-br from-orange-500 to-pink-500">
              <img 
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=144" 
                alt="Creative design workspace" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="font-semibold">Adobe Creative Suite</p>
                  <p className="text-sm text-slate-200">Mới nhất</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Danh mục sản phẩm</h2>
        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="w-12 h-12 mx-auto mb-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Sản phẩm nổi bật</h2>
          <Link href="/collections/giai-tri" className="text-blue-600 hover:text-blue-500 font-medium flex items-center">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Từ khóa nổi bật</h2>
          <div className="flex flex-wrap gap-3">
            {["Làm việc", "Giải trí", "Học tập", "AI", "Wallet", "Youtube", "Steam", "Design"].map((tag) => (
              <Link 
                key={tag}
                href="/collections/giai-tri" 
                className="bg-slate-100 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full text-slate-700 transition-all duration-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Preview */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Sản phẩm mới</h2>
          <Link href="/collections/giai-tri" className="text-blue-600 hover:text-blue-500 font-medium flex items-center">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Đăng ký nhận ưu đãi</h2>
          <p className="mb-6 text-slate-100">Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
          <div className="flex max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Nhập email của bạn" 
              className="flex-1 text-slate-800 border-0 rounded-r-none"
            />
            <Button className="bg-white text-blue-600 hover:bg-slate-100 rounded-l-none border-0">
              Đăng ký
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
