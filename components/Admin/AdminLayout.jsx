import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  const { isLoggedIn, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user?.isAdmin) {
      router.replace('/');
    }
  }, [isLoading, isLoggedIn, user, pathname, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: '#388e3c' }}></i>
      </div>
    );
  }

  if (!isLoggedIn || !user?.isAdmin) {
    return null;
  }

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
            href="/admin/trees"
            className={pathname.startsWith("/admin/trees") ? "active" : ""}
          >
            <i className="fas fa-tree"></i> Trees
          </Link>

          <Link
            href="/admin/customers"
            className={pathname.startsWith("/admin/customers") ? "active" : ""}
          >
            <i className="fas fa-users"></i> Customers
          </Link>

          <Link
            href="/admin/customerdeletion"
            className={pathname.startsWith("/admin/customerdeletion") ? "active" : ""}
          >
            <i className="fas fa-users"></i> Deletion Requests
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
            href="/admin/notifications"
            className={pathname.startsWith("/admin/notifications") ? "active" : ""}
          >
            <i className="fas fa-bell"></i> Notifications
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
