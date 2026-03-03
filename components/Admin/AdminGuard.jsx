"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Guard for App Router admin pages (app/admin/encyclopedia/*).
 * Can't use AuthContext (Pages Router only), so fetches /api/auth/me directly.
 */
export default function AdminGuard({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // "loading" | "authorized" | "unauthorized"

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.user?.isAdmin) {
          setStatus("unauthorized");
          router.replace(data ? "/" : "/login");
        } else {
          setStatus("authorized");
        }
      })
      .catch(() => {
        setStatus("unauthorized");
        router.replace("/login");
      });
  }, [router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#388e3c" }}></i>
      </div>
    );
  }

  if (status === "unauthorized") {
    return null;
  }

  return children;
}
