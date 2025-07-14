import { users, categories, products, blogPosts, type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type BlogPost, type InsertBlogPost } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(params?: { categoryId?: number; featured?: boolean; limit?: number; search?: string }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categorySlug: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Blog
  getBlogPosts(params?: { featured?: boolean; limit?: number; category?: string }): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number = 1;
  private currentCategoryId: number = 1;
  private currentProductId: number = 1;
  private currentBlogPostId: number = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData: InsertCategory[] = [
      { name: "Giải trí", slug: "giai-tri", description: "Dịch vụ giải trí số", icon: "fas fa-gamepad", productCount: 1500 },
      { name: "Làm việc", slug: "lam-viec", description: "Công cụ làm việc", icon: "fas fa-briefcase", productCount: 800 },
      { name: "Học tập", slug: "hoc-tap", description: "Tài liệu học tập", icon: "fas fa-graduation-cap", productCount: 650 },
      { name: "Thế giới AI", slug: "the-gioi-ai", description: "Công cụ AI", icon: "fas fa-robot", productCount: 200 },
      { name: "Thiết kế", slug: "thiet-ke", description: "Phần mềm thiết kế", icon: "fas fa-palette", productCount: 450 },
    ];

    categoriesData.forEach(cat => this.createCategory(cat));

    // Seed products
    const productsData: InsertProduct[] = [
      {
        name: "Netflix Premium 1 tháng",
        slug: "netflix-premium-1-thang",
        description: "Trải nghiệm Netflix Premium với chất lượng Ultra HD 4K, hỗ trợ xem trên 4 thiết bị cùng lúc. Thưởng thức hàng nghìn bộ phim, series độc quyền từ Netflix Originals và nội dung giải trí đa dạng.",
        shortDescription: "Xem phim HD không giới hạn, 4 thiết bị cùng lúc",
        price: "129000",
        salePrice: "99000",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [
          "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1489599511686-bbedd1cb711d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
        ],
        categoryId: 1,
        featured: true,
        rating: "4.8",
        reviewCount: 128,
        tags: ["streaming", "phim", "series"],
        features: ["Chất lượng Ultra HD 4K", "Xem trên 4 thiết bị cùng lúc", "Tải về xem offline", "Netflix Originals độc quyền", "Không quảng cáo"]
      },
      {
        name: "YouTube Premium 1 tháng",
        slug: "youtube-premium-1-thang",
        description: "YouTube Premium mang đến trải nghiệm xem video hoàn hảo không quảng cáo, tải video offline và phát nhạc nền.",
        shortDescription: "Xem video không quảng cáo, tải về offline",
        price: "79000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [
          "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1521737451811-71c4484daa55?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
        ],
        categoryId: 1,
        featured: true,
        rating: "4.6",
        reviewCount: 89,
        tags: ["youtube", "video", "music"],
        features: ["Không quảng cáo", "Tải offline", "Phát nhạc nền", "YouTube Music Premium"]
      },
      {
        name: "Adobe Creative Cloud",
        slug: "adobe-creative-cloud",
        description: "Bộ công cụ thiết kế chuyên nghiệp từ Adobe bao gồm Photoshop, Illustrator, Premiere Pro và nhiều ứng dụng khác.",
        shortDescription: "Bộ công cụ thiết kế chuyên nghiệp",
        price: "299000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
        ],
        categoryId: 5,
        featured: true,
        rating: "4.9",
        reviewCount: 256,
        tags: ["design", "adobe", "creative"],
        features: ["Photoshop CC", "Illustrator CC", "Premiere Pro", "After Effects", "Cloud Storage 100GB"]
      },
      {
        name: "Microsoft Office 365",
        slug: "microsoft-office-365",
        description: "Bộ công cụ văn phòng hoàn chỉnh từ Microsoft bao gồm Word, Excel, PowerPoint, Outlook và OneDrive.",
        shortDescription: "Bộ công cụ văn phòng hoàn chỉnh",
        price: "199000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 2,
        featured: true,
        rating: "4.7",
        reviewCount: 342,
        tags: ["office", "microsoft", "productivity"],
        features: ["Word, Excel, PowerPoint", "Outlook Email", "OneDrive 1TB", "Teams", "Cập nhật tự động"]
      },
      {
        name: "Spotify Premium 1 tháng",
        slug: "spotify-premium-1-thang",
        description: "Nghe nhạc chất lượng cao không quảng cáo với thư viện hơn 100 triệu bài hát.",
        shortDescription: "Nghe nhạc chất lượng cao, không quảng cáo",
        price: "59000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 1,
        featured: false,
        rating: "4.5",
        reviewCount: 167,
        tags: ["music", "streaming", "audio"],
        features: ["Chất lượng 320kbps", "Tải offline", "Không quảng cáo", "Podcasts độc quyền"]
      },
      {
        name: "Disney+ Premium",
        slug: "disney-plus-premium",
        description: "Xem phim Disney, Marvel, Star Wars và National Geographic với chất lượng 4K.",
        shortDescription: "Xem phim Disney, Marvel, Star Wars",
        price: "89000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 1,
        featured: false,
        rating: "4.4",
        reviewCount: 92,
        tags: ["disney", "marvel", "starwars"],
        features: ["Phim Disney Classic", "Marvel Universe", "Star Wars Saga", "National Geographic", "Chất lượng 4K"]
      },
      {
        name: "Canva Pro 1 năm",
        slug: "canva-pro-1-nam",
        description: "Công cụ thiết kế đồ họa trực tuyến mạnh mẽ với hàng triệu template, ảnh stock premium và tính năng AI.",
        shortDescription: "Thiết kế đồ họa chuyên nghiệp",
        price: "390000",
        salePrice: "299000",
        imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 5,
        featured: true,
        rating: "4.7",
        reviewCount: 178,
        tags: ["design", "graphics", "templates"],
        features: ["Premium templates", "AI Design tools", "Background remover", "Magic resize", "Brand kit"]
      },
      {
        name: "Grammarly Premium",
        slug: "grammarly-premium",
        description: "Trợ lý viết AI giúp cải thiện ngữ pháp, phong cách viết và tăng hiệu quả giao tiếp.",
        shortDescription: "Trợ lý viết AI thông minh",
        price: "149000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 2,
        featured: false,
        rating: "4.6",
        reviewCount: 145,
        tags: ["writing", "ai", "productivity"],
        features: ["Grammar checking", "Style suggestions", "Plagiarism detection", "Tone detector", "Writing insights"]
      },
      {
        name: "Coursera Plus",
        slug: "coursera-plus",
        description: "Truy cập không giới hạn hơn 7,000 khóa học từ các trường đại học và tổ chức hàng đầu thế giới.",
        shortDescription: "Học online không giới hạn",
        price: "499000",
        salePrice: "399000",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 3,
        featured: true,
        rating: "4.8",
        reviewCount: 223,
        tags: ["education", "courses", "certificates"],
        features: ["7,000+ courses", "University certificates", "Specializations", "Professional certificates", "Unlimited access"]
      },
      {
        name: "ChatGPT Plus",
        slug: "chatgpt-plus",
        description: "Phiên bản cao cấp của ChatGPT với GPT-4, tốc độ nhanh hơn và ưu tiên truy cập.",
        shortDescription: "AI ChatGPT phiên bản nâng cao",
        price: "199000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 4,
        featured: true,
        rating: "4.9",
        reviewCount: 312,
        tags: ["ai", "chatbot", "gpt"],
        features: ["GPT-4 access", "Faster response", "Priority access", "Advanced reasoning", "Creative writing"]
      },
      {
        name: "Figma Professional",
        slug: "figma-professional",
        description: "Công cụ thiết kế UI/UX hàng đầu cho team với tính năng collaboration và prototyping mạnh mẽ.",
        shortDescription: "Thiết kế UI/UX chuyên nghiệp",
        price: "299000",
        salePrice: null,
        imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        thumbnails: [],
        categoryId: 5,
        featured: false,
        rating: "4.8",
        reviewCount: 189,
        tags: ["ui", "ux", "design", "prototyping"],
        features: ["Unlimited projects", "Team collaboration", "Advanced prototyping", "Design systems", "Developer handoff"]
      }
    ];

    productsData.forEach(product => this.createProduct(product));

    // Seed blog posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "Top 10 công cụ AI tốt nhất cho năm 2024",
        slug: "top-10-cong-cu-ai-tot-nhat-2024",
        excerpt: "Khám phá những công cụ AI mạnh mẽ nhất đang thay đổi cách chúng ta làm việc, từ ChatGPT, Midjourney đến các ứng dụng AI trong thiết kế và lập trình...",
        content: "Trí tuệ nhân tạo đang revolutionize cách chúng ta làm việc và sáng tạo. Trong bài viết này, chúng ta sẽ khám phá 10 công cụ AI hàng đầu năm 2024...",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        categoryName: "Công nghệ",
        readTime: 8,
        featured: true
      },
      {
        title: "So sánh Netflix vs Disney+ vs Amazon Prime",
        slug: "so-sanh-netflix-disney-amazon-prime",
        excerpt: "Phân tích chi tiết các dịch vụ streaming hàng đầu để giúp bạn chọn lựa phù hợp...",
        content: "Các dịch vụ streaming ngày càng phổ biến tại Việt Nam. Hãy cùng so sánh 3 platform hàng đầu...",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        categoryName: "Giải trí",
        readTime: 6,
        featured: false
      },
      {
        title: "10 mẹo tăng hiệu suất với Microsoft Office 365",
        slug: "10-meo-tang-hieu-suat-microsoft-office-365",
        excerpt: "Khám phá những tính năng ẩn và mẹo sử dụng Office 365 hiệu quả hơn...",
        content: "Microsoft Office 365 có rất nhiều tính năng hữu ích mà ít người biết đến...",
        imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        categoryName: "Làm việc",
        readTime: 7,
        featured: false
      },
      {
        title: "Hướng dẫn mua game Steam giá rẻ",
        slug: "huong-dan-mua-game-steam-gia-re",
        excerpt: "Bí quyết săn sale Steam và những website uy tín bán key game giá tốt...",
        content: "Steam luôn có những đợt sale hấp dẫn. Đây là hướng dẫn chi tiết để bạn mua được game yêu thích với giá tốt nhất...",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        categoryName: "Gaming",
        readTime: 5,
        featured: false
      },
      {
        title: "Adobe Creative Cloud cho người mới bắt đầu",
        slug: "adobe-creative-cloud-cho-nguoi-moi-bat-dau",
        excerpt: "Hướng dẫn từ A-Z sử dụng Photoshop, Illustrator và Premiere Pro...",
        content: "Adobe Creative Cloud là bộ công cụ thiết kế mạnh mẽ nhất hiện nay. Bài viết này sẽ hướng dẫn bạn từ những bước đầu tiên...",
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        categoryName: "Thiết kế",
        readTime: 10,
        featured: false
      }
    ];

    blogPostsData.forEach(post => this.createBlogPost(post));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(params?: { categoryId?: number; featured?: boolean; limit?: number; search?: string }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (params?.categoryId) {
      products = products.filter(p => p.categoryId === params.categoryId);
    }

    if (params?.featured !== undefined) {
      products = products.filter(p => p.featured === params.featured);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (params?.limit) {
      products = products.slice(0, params.limit);
    }

    return products.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    return this.getProducts({ categoryId: category.id });
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  // Blog methods
  async getBlogPosts(params?: { featured?: boolean; limit?: number; category?: string }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());

    if (params?.featured !== undefined) {
      posts = posts.filter(p => p.featured === params.featured);
    }

    if (params?.category) {
      posts = posts.filter(p => p.categoryName.toLowerCase() === params.category.toLowerCase());
    }

    if (params?.limit) {
      posts = posts.slice(0, params.limit);
    }

    return posts.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = { 
      ...insertBlogPost, 
      id,
      publishedAt: new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
