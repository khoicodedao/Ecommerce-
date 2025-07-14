import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CollectionsPage from "@/pages/collections";
import ProductPage from "@/pages/product";
import BlogPage from "@/pages/blog";
import CartPage from "@/pages/cart";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";

function Router() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/collections/:slug" component={CollectionsPage} />
            <Route path="/product/:slug" component={ProductPage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/blog/:slug" component={BlogPage} />
            <Route path="/cart" component={CartPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
