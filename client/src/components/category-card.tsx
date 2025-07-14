import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/collections/${category.slug}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6 text-center h-full flex flex-col justify-center">
          <div className="w-12 h-12 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform">
            <i className={`${category.icon} text-3xl`}></i>
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-slate-500">
            {category.productCount?.toLocaleString('vi-VN')}+ sản phẩm
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
