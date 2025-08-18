import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { ModelManagement } from "@/components/admin/model-management"

export default async function AdminModelsPage() {
  const supabase = createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email?.includes("admin")) {
    redirect("/")
  }

  // Get all models with content count
  const { data: models } = await supabase
    .from("models")
    .select(`
    *,
    contents (count)
  `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <ModelManagement models={models || []} />
      </main>
    </div>
  )
}
