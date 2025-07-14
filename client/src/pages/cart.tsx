import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "1": return "1 tháng";
      case "3": return "3 tháng";
      case "6": return "6 tháng";
      case "12": return "12 tháng";
      default: return "1 tháng";
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Giỏ hàng trống</h1>
          <p className="text-slate-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li><Link href="/" className="text-blue-600 hover:text-blue-500">Trang chủ</Link></li>
          <li className="text-slate-400">/</li>
          <li className="text-slate-600">Giỏ hàng</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Giỏ hàng ({getTotalItems()} sản phẩm)
            </h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.duration}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Link href={`/product/${item.product.slug}`}>
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 hover:opacity-75 transition-opacity"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-semibold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm text-slate-500">
                          Thời hạn: {getDurationLabel(item.duration)}
                        </span>
                        {item.product.salePrice && (
                          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                            Giảm giá
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(parseFloat(item.price))}
                          </span>
                          {item.product.salePrice && (
                            <span className="text-sm text-slate-400 line-through">
                              {formatPrice(parseFloat(item.product.price))}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-slate-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 text-center min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 text-right">
                        <span className="text-sm text-slate-600">
                          Thành tiền: <span className="font-semibold">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tạm tính:</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Phí giao hàng:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Giảm giá:</span>
                  <span className="font-medium">0₫</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-slate-800">Tổng cộng:</span>
                  <span className="font-bold text-blue-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Thanh toán ngay
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Chính sách mua hàng</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Giao hàng tức thì qua email</li>
                  <li>• Bảo hành 30 ngày</li>
                  <li>• Hỗ trợ 24/7</li>
                  <li>• Đổi trả trong 7 ngày</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}