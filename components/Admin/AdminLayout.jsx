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
          passHref
          legacyBehavior
        >
          <a
            style={{
              color: "#388e3c",
              textDecoration: "none",
              marginTop: 0,
              marginBottom: 10,
              display: "inline-block",
            }}
          >
            <i className="fas fa-arrow-left"></i> MyProfile
          </a>
        </Link>

        <nav className="flex flex-col space-y-2 mt-4">
          <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className={pathname.startsWith("/admin/orders") ? "active" : ""}
          >
            Orders
          </Link>
          <Link
            href="/admin/customers"
            className={pathname.startsWith("/admin/customers") ? "active" : ""}
          >
            Customers
          </Link>
          <Link
            href="/admin/products"
            className={pathname.startsWith("/admin/products") ? "active" : ""}
          >
            Products
          </Link>
          <Link
            href="/admin/blogs"
            className={pathname.startsWith("/admin/blogs") ? "active" : ""}
          >
            Blogs
          </Link>
          <Link
            href="/admin/donation"
            className={pathname.startsWith("/admin/donation") ? "active" : ""}
          >
            Donations
          </Link>
          <Link
            href="/admin/coupons"
            className={pathname.startsWith("/admin/coupons") ? "active" : ""}
          >
            Coupons
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
