import React from "react";
import AdminDeletionRequests from "@/components/Admin/AdminDeletionRequests";
import AdminLayout from "@/components/Admin/AdminLayout";

const AdminCustomerPage = () => {
  return <AdminLayout>
            <AdminDeletionRequests />
        </AdminLayout>;
};

export default AdminCustomerPage;
