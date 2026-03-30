import React from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import AdminTrees from "@/components/Admin/AdminTrees";
import "../../styles/admin-trees.css";

export default function AdminTreesPage() {
  return (
    <AdminLayout>
      <AdminTrees />
    </AdminLayout>
  );
}
