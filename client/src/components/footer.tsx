import { Link } from "wouter";
import { Facebook, Youtube, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Digital Store</h3>
            <p className="text-slate-300 mb-4">
              Cửa hàng số hàng đầu Việt Nam, chuyên cung cấp các sản phẩm digital chất lượng cao với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors">Hướng dẫn thanh toán</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Danh mục sản phẩm</h4>
            <ul className="space-y-2">
              <li><Link href="/collections/giai-tri" className="text-slate-300 hover:text-white transition-colors">Giải trí</Link></li>
              <li><Link href="/collections/lam-viec" className="text-slate-300 hover:text-white transition-colors">Làm việc</Link></li>
              <li><Link href="/collections/hoc-tap" className="text-slate-300 hover:text-white transition-colors">Học tập</Link></li>
              <li><Link href="/collections/the-gioi-ai" className="text-slate-300 hover:text-white transition-colors">Thế giới AI</Link></li>
              <li><Link href="/collections/thiet-ke" className="text-slate-300 hover:text-white transition-colors">Thiết kế</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-slate-300">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-slate-300">1900-xxx-xxx</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-slate-300">support@digitalstore.vn</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-slate-300">24/7 - Hỗ trợ liên tục</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-300">
            © 2024 Digital Store. Tất cả quyền được bảo lưu. |{" "}
            <Link href="#" className="text-blue-400 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>{" "}
            |{" "}
            <Link href="#" className="text-blue-400 hover:text-white transition-colors">
              Điều khoản dịch vụ
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
