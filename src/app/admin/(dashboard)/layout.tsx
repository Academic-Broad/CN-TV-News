import { AdminSidebar } from "@/components/admin/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
