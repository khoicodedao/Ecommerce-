import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, featured, limit, search } = req.query;
      
      const params: any = {};
      if (categoryId) params.categoryId = parseInt(categoryId as string);
      if (featured !== undefined) params.featured = featured === 'true';
      if (limit) params.limit = parseInt(limit as string);
      if (search) params.search = search as string;

      const products = await storage.getProducts(params);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Special route for query string parameters (e.g., /api/products/featured=true&limit=4)
  app.get("/api/products/:params", async (req, res) => {
    try {
      const paramString = req.params.params;
      const searchParams = new URLSearchParams(paramString);
      
      const params: any = {};
      const categoryId = searchParams.get('categoryId');
      const featured = searchParams.get('featured');
      const limit = searchParams.get('limit');
      const search = searchParams.get('search');
      
      if (categoryId) params.categoryId = parseInt(categoryId);
      if (featured !== null) params.featured = featured === 'true';
      if (limit) params.limit = parseInt(limit);
      if (search) params.search = search;

      const products = await storage.getProducts(params);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/product/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/categories/:slug/products", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.slug);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category products" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { featured, limit, category } = req.query;
      
      const params: any = {};
      if (featured !== undefined) params.featured = featured === 'true';
      if (limit) params.limit = parseInt(limit as string);
      if (category) params.category = category as string;

      const posts = await storage.getBlogPosts(params);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Special route for query string parameters (e.g., /api/blog/featured=true&limit=1)
  app.get("/api/blog/:params", async (req, res) => {
    try {
      const paramString = req.params.params;
      
      // Check if it's a slug (not containing =)
      if (!paramString.includes('=')) {
        const post = await storage.getBlogPostBySlug(paramString);
        if (!post) {
          return res.status(404).json({ message: "Blog post not found" });
        }
        return res.json(post);
      }
      
      // Handle query parameters
      const searchParams = new URLSearchParams(paramString);
      
      const params: any = {};
      const featured = searchParams.get('featured');
      const limit = searchParams.get('limit');
      const category = searchParams.get('category');
      
      if (featured !== null) params.featured = featured === 'true';
      if (limit) params.limit = parseInt(limit);
      if (category) params.category = category;

      const posts = await storage.getBlogPosts(params);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const { q, limit } = req.query;
      if (!q) {
        return res.json([]);
      }
      
      const products = await storage.getProducts({
        search: q as string,
        limit: limit ? parseInt(limit as string) : 20
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
