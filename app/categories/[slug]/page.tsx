import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { CategoryHeader } from "@/components/categories/category-header"
import { ContentGrid } from "@/components/content-grid"
import { ContentFilters } from "@/components/categories/content-filters"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const supabase = createClient()

  // Get category details
  const { data: category, error } = await supabase.from("categories").select("*").eq("slug", params.slug).single()

  if (error || !category) {
    notFound()
  }

  // Build query for content
  let query = supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .eq("category_id", category.id)

  // Apply sorting
  const sort = searchParams.sort || "recent"
  switch (sort) {
    case "recent":
      query = query.order("created_at", { ascending: false })
      break
    case "popular":
      query = query.order("view_count", { ascending: false })
      break
    case "title":
      query = query.order("title", { ascending: true })
      break
  }

  const { data: categoryContent } = await query

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="pt-16">
        {/* Category Header */}
        <CategoryHeader category={category} contentCount={categoryContent?.length || 0} />

        {/* Filters and Content */}
        <div className="container mx-auto px-4 py-8">
          <ContentFilters currentSort={sort} categorySlug={params.slug} />

          {categoryContent && categoryContent.length > 0 ? (
            <ContentGrid title="" content={categoryContent} className="mt-6" />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No content found</h3>
              <p className="text-gray-400">This category doesn't have any content yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
