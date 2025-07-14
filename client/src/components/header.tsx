import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems, setIsOpen } = useCart();

  // Search products
  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const navigation = [
    { name: "Trang chủ", href: "/", current: location === "/" },
    { name: "Danh mục", href: "/collections/giai-tri", current: location.startsWith("/collections") },
    { name: "Sản phẩm", href: "/collections/giai-tri", current: false },
    { name: "Blog", href: "/blog", current: location.startsWith("/blog") },
    { name: "Hỗ trợ", href: "#", current: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/collections/giai-tri?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleProductSelect = (productSlug: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    window.location.href = `/product/${productSlug}`;
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(parseInt(price)) + '₫';
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">📞 Hotline: 1900-xxx-xxx</span>
            <span className="text-slate-600 hidden md:inline">✉️ support@digitalstore.vn</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              Đăng nhập
            </Link>
            <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Digital Store
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    item.current
                      ? "text-blue-600"
                      : "text-slate-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search bar - Desktop */}
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative hidden md:block">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(e.target.value.length > 0);
                    }}
                    onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                    className="w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandList>
                    {searchResults && searchResults.length > 0 ? (
                      <CommandGroup heading="Sản phẩm">
                        {searchResults.slice(0, 5).map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => handleProductSelect(product.slug)}
                            className="flex items-center space-x-3 px-3 py-2 cursor-pointer"
                          >
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-blue-600 text-sm">
                                {formatPrice(product.salePrice || product.price)}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                        {searchResults.length > 5 && (
                          <CommandItem
                            onSelect={() => {
                              setIsSearchOpen(false);
                              window.location.href = `/collections/giai-tri?search=${encodeURIComponent(searchQuery)}`;
                            }}
                            className="text-center text-blue-600 font-medium"
                          >
                            Xem thêm {searchResults.length - 5} kết quả...
                          </CommandItem>
                        )}
                      </CommandGroup>
                    ) : searchQuery.length > 0 ? (
                      <CommandEmpty>Không tìm thấy sản phẩm nào.</CommandEmpty>
                    ) : null}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                          item.current
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
