import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardStats } from "@/components/admin/dashboard-stats"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // For demo purposes, check if user email contains "admin"
  // In production, you'd have a proper admin role system
  if (!user.email?.includes("admin")) {
    redirect("/")
  }

  // Get dashboard statistics
  const [
    { count: totalUsers },
    { count: totalContent },
    { count: totalModels },
    { data: todaySales },
    { data: monthSales },
    { data: topContent },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("contents").select("*", { count: "exact", head: true }),
    supabase.from("models").select("*", { count: "exact", head: true }),
    supabase.from("purchases").select("amount_paid").gte("purchase_date", new Date().toISOString().split("T")[0]),
    supabase
      .from("purchases")
      .select("amount_paid")
      .gte("purchase_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from("contents").select("title, view_count").order("view_count", { ascending: false }).limit(5),
  ])

  const todayRevenue = todaySales?.reduce((sum, sale) => sum + sale.amount_paid, 0) || 0
  const monthRevenue = monthSales?.reduce((sum, sale) => sum + sale.amount_paid, 0) || 0

  const stats = {
    totalUsers: totalUsers || 0,
    totalContent: totalContent || 0,
    totalModels: totalModels || 0,
    todayRevenue,
    monthRevenue,
    todaySales: todaySales?.length || 0,
    monthSales: monthSales?.length || 0,
    topContent: topContent || [],
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your Hotflix platform</p>
        </div>

        <DashboardStats stats={stats} />
      </main>
    </div>
  )
}
