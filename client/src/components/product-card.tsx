import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const salePercentage = product.salePrice 
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)
    : 0;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(parseInt(price)) + '₫';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {salePercentage > 0 && (
            <Badge variant="destructive" className="text-xs font-semibold">
              -{salePercentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="secondary" className="text-xs font-semibold bg-green-500 text-white">
              Hot
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        {product.rating && parseFloat(product.rating) > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(parseFloat(product.rating!)) 
                      ? 'fill-current' 
                      : 'stroke-current fill-none'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-slate-500">
              ({product.reviewCount} đánh giá)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-500"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
