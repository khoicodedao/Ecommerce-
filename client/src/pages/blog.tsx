import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Search, Calendar, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: featuredPost } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/featured=true&limit=1"],
  });

  const { data: singlePost } = useQuery<BlogPost>({
    queryKey: ["/api/blog/" + slug],
    enabled: !!slug,
  });

  const categories = Array.from(new Set(blogPosts?.map(post => post.categoryName) || []));

  const filteredPosts = blogPosts?.filter(post => 
    !searchQuery || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // If viewing a single blog post
  if (slug && singlePost) {
    return (
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-blue-600 hover:text-blue-500">Trang chủ</a></li>
            <li className="text-slate-400">/</li>
            <li><a href="/blog" className="text-blue-600 hover:text-blue-500">Blog</a></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-600">{singlePost.title}</li>
          </ol>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge>{singlePost.categoryName}</Badge>
              <div className="flex items-center text-slate-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(singlePost.publishedAt!)}
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {singlePost.readTime} phút đọc
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">{singlePost.title}</h1>
            <p className="text-xl text-slate-600">{singlePost.excerpt}</p>
          </header>

          <div className="mb-8">
            <img 
              src={singlePost.imageUrl} 
              alt={singlePost.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: singlePost.content.replace(/\n/g, '<br>') }} />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Blog công nghệ</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Cập nhật những xu hướng công nghệ mới nhất, hướng dẫn sử dụng và đánh giá sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Article */}
          {featuredPost && featuredPost[0] && (
            <Card className="overflow-hidden mb-8">
              <img 
                src={featuredPost[0].imageUrl} 
                alt={featuredPost[0].title}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge className="bg-blue-600">{featuredPost[0].categoryName}</Badge>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(featuredPost[0].publishedAt!)}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  <a href={`/blog/${featuredPost[0].slug}`} className="hover:text-blue-600 transition-colors">
                    {featuredPost[0].title}
                  </a>
                </h2>
                <p className="text-slate-600 mb-4">{featuredPost[0].excerpt}</p>
                <a 
                  href={`/blog/${featuredPost[0].slug}`} 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Đọc thêm →
                </a>
              </CardContent>
            </Card>
          )}

          {/* Article Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-slate-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-3"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts?.filter(post => !post.featured).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{post.categoryName}</Badge>
                      <div className="flex items-center text-slate-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.publishedAt!)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <a 
                      href={`/blog/${post.slug}`} 
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Đọc thêm →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Search */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-4">Tìm kiếm</h3>
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
          </Card>

          {/* Categories */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = blogPosts?.filter(post => post.categoryName === category).length || 0;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <a 
                      href="#" 
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {category}
                    </a>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Popular Posts */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Bài viết phổ biến</h3>
            <div className="space-y-4">
              {blogPosts?.slice(0, 3).map((post) => (
                <div key={post.id} className="flex space-x-3">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-800 line-clamp-2 mb-1">
                      <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </a>
                    </h4>
                    <p className="text-xs text-slate-500">
                      {formatDate(post.publishedAt!)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
