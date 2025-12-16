import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="admin-panel flex h-screen">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 bg-gray-100 border-r p-4 overflow-y-auto">
        <Link
          href="/profile"
          style={{
            color: "#388e3c",
            textDecoration: "none",
            marginTop: 0,
            marginBottom: 10,
            display: "inline-block",
          }}
        >
          <i className="fas fa-arrow-left"></i> MyProfile
        </Link>

        <nav className="flex flex-col space-y-2 mt-4">
          <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>
          
          <Link
            href="/admin/orders"
            className={pathname.startsWith("/admin/orders") ? "active" : ""}
          >
            <i className="fas fa-box"></i> Orders
          </Link>
          
          <Link
            href="/admin/gift-orders"
            className={pathname.startsWith("/admin/gift-orders") ? "active" : ""}
          >
            <i className="fas fa-gift"></i> Gift Orders
          </Link>
          
          <Link
            href="/admin/customers"
            className={pathname.startsWith("/admin/customers") ? "active" : ""}
          >
            <i className="fas fa-users"></i> Customers
          </Link>
          
          <Link
            href="/admin/products"
            className={pathname.startsWith("/admin/products") ? "active" : ""}
          >
            <i className="fas fa-seedling"></i> Products
          </Link>
          
          <Link
            href="/admin/blogs"
            className={pathname.startsWith("/admin/blogs") ? "active" : ""}
          >
            <i className="fas fa-blog"></i> Blogs
          </Link>
          
          <Link
            href="/admin/donation"
            className={pathname.startsWith("/admin/donation") ? "active" : ""}
          >
            <i className="fas fa-hand-holding-heart"></i> Donations
          </Link>
          
          <Link
            href="/admin/coupons"
            className={pathname.startsWith("/admin/coupons") ? "active" : ""}
          >
            <i className="fas fa-ticket-alt"></i> Coupons
          </Link>
          
          <Link
            href="/admin/encyclopedia/articles"
            className={pathname.startsWith("/admin/encyclopedia/articles") ? "active" : ""}
          >
            <i className="fas fa-book"></i> Encyclopedia
            <span className="new-badge">NEW</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;