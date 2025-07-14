import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Star, ShoppingCart, Clock, Shield, Headphones, Minus, Plus, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/product/" + slug],
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/categoryId=" + (product?.categoryId || '') + "&limit=4"],
    enabled: !!product?.categoryId,
  });

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLightboxOpen || !product) return;
      
      const galleryImages = [product.imageUrl, ...(product.thumbnails || [])];
      
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0);
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isLightboxOpen, selectedImageIndex, product]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-96 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="w-full h-96 bg-slate-200 rounded-xl mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-20 bg-slate-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Sản phẩm không tồn tại</h1>
        <p className="text-slate-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const salePercentage = product.salePrice 
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)
    : 0;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(parseInt(price)) + '₫';
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedDurationObj = durations.find(d => d.value === selectedDuration);
    const price = selectedDurationObj ? selectedDurationObj.price : product.salePrice || product.price;
    
    addItem(product, quantity, selectedDuration);
    toast({
      title: "Thêm vào giỏ hàng thành công!",
      description: `${quantity} x ${product.name} (${selectedDurationObj?.label}) đã được thêm vào giỏ hàng.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    // Navigate to cart or checkout page
    window.location.href = "/cart";
  };

  const durations = [
    { value: "1", label: "1 tháng", price: product.salePrice || product.price },
    { value: "3", label: "3 tháng", price: (parseFloat(product.salePrice || product.price) * 2.8).toString() },
    { value: "6", label: "6 tháng", price: (parseFloat(product.salePrice || product.price) * 5.3).toString() },
    { value: "12", label: "12 tháng", price: (parseFloat(product.salePrice || product.price) * 10).toString() },
  ];

  const selectedPrice = durations.find(d => d.value === selectedDuration)?.price || product.price;
  
  // Create gallery array with main image first, then thumbnails
  const galleryImages = [product.imageUrl, ...(product.thumbnails || [])];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li><a href="/" className="text-blue-600 hover:text-blue-500">Trang chủ</a></li>
          <li className="text-slate-400">/</li>
          <li><a href="/collections/giai-tri" className="text-blue-600 hover:text-blue-500">Sản phẩm</a></li>
          <li className="text-slate-400">/</li>
          <li className="text-slate-600">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div>
          {/* Main Image Display */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 group relative cursor-zoom-in">
            <img 
              src={galleryImages[selectedImageIndex]} 
              alt={`${product.name} - Hình ${selectedImageIndex + 1}`}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              onClick={() => setIsLightboxOpen(true)}
            />
            
            {/* Zoom Icon */}
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-4 w-4" />
            </div>
            
            {/* Image Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❯
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index 
                      ? "ring-2 ring-blue-600 ring-offset-2" 
                      : "hover:opacity-75"
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - Ảnh ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-blue-600/20"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            {product.rating && parseFloat(product.rating) > 0 && (
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(parseFloat(product.rating!)) 
                          ? 'fill-current' 
                          : 'stroke-current fill-none'
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-slate-600">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
            )}
            <Badge variant="secondary" className="text-green-600 bg-green-50">
              Còn hàng
            </Badge>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(selectedPrice)}
            </span>
            {product.salePrice && (
              <>
                <span className="text-xl text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="destructive">-{salePercentage}%</Badge>
              </>
            )}
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-slate-600">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <>
                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Tính năng nổi bật:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="space-y-4">
            {/* Duration Selection */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-slate-700">Thời hạn:</span>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map(duration => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label} - {formatPrice(duration.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-slate-700">Số lượng:</span>
              <div className="flex items-center border border-slate-300 rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 border-x border-slate-300">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-500"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ hàng
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Thông tin giao hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-3" />
                    <span>Giao hàng tức thì qua email</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-3" />
                    <span>Bảo hành 30 ngày</span>
                  </div>
                  <div className="flex items-center">
                    <Headphones className="h-4 w-4 text-blue-600 mr-3" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="guide">Hướng dẫn</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Chi tiết sản phẩm {product.name}
              </h3>
              <p className="text-slate-600 mb-4">{product.description}</p>
              
              {product.features && (
                <>
                  <h4 className="font-semibold text-slate-800 mb-2">Tính năng chính:</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Hướng dẫn sử dụng</h3>
              <p className="text-slate-600 mb-4">
                Sau khi thanh toán thành công, bạn sẽ nhận được thông tin tài khoản qua email đã đăng ký.
              </p>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Kiểm tra email sau khi thanh toán thành công</li>
                <li>Đăng nhập vào tài khoản với thông tin đã nhận</li>
                <li>Thay đổi mật khẩu nếu cần thiết</li>
                <li>Liên hệ hỗ trợ nếu gặp vấn đề</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-8">
              <p className="text-slate-600">Chức năng đánh giá đang được phát triển.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
          </div>
        </section>
      )}

      {/* Image Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            {/* Main Lightbox Image */}
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`${product.name} - Hình ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-all"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-all"
                >
                  ❯
                </button>
              </>
            )}
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="bg-black/50 px-4 py-2 rounded-lg">
                {selectedImageIndex + 1} / {galleryImages.length} - {product.name}
              </p>
              <p className="text-sm mt-2 opacity-75">
                Sử dụng ← → để điều hướng, ESC để đóng
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
