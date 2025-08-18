import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { ContentManagement } from "@/components/admin/content-management"

export default async function AdminContentPage() {
  const supabase = createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email?.includes("admin")) {
    redirect("/")
  }

  // Get all content with related data
  const { data: content } = await supabase
    .from("contents")
    .select(`
      *,
      models (id, name),
      categories (id, name)
    `)
    .order("created_at", { ascending: false })

  // Get models and categories for forms
  const [{ data: models }, { data: categories }] = await Promise.all([
    supabase.from("models").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ])

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <ContentManagement content={content || []} models={models || []} categories={categories || []} />
      </main>
    </div>
  )
}
