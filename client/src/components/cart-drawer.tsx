import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Giỏ hàng ({getTotalItems()})
          </SheetTitle>
          <SheetDescription>
            Quản lý các sản phẩm trong giỏ hàng của bạn
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-slate-600 mb-6">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
              <Button onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-500">
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.duration}`} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 mb-1 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-slate-500 mb-2">
                          {getDurationLabel(item.duration)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-600">
                            {formatPrice(parseFloat(item.price))}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center border border-slate-300 rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 py-1 text-sm min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-slate-800">Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Link href="/cart">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Xem giỏ hàng
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Thanh toán ngay
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}