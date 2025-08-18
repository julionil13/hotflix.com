import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const supabase = createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email?.includes("admin")) {
    redirect("/")
  }

  // Get all users with their access status
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <UserManagement users={users || []} />
      </main>
    </div>
  )
}
