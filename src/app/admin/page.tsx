import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
export const metadata: Metadata = {
  title: "Store admin",
  robots: { index: false, follow: false },
};
export default function Admin() {
  return (
    <div className="section container admin-container">
      <AdminDashboard />
    </div>
  );
}
