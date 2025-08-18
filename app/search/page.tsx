import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { SearchResults } from "@/components/search/search-results"

interface SearchPageProps {
  searchParams: {
    q?: string
    sort?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient()
  const query = searchParams.q || ""
  const sort = searchParams.sort || "recent"

  let results: any[] = []

  if (query.trim()) {
    // Search in content titles and descriptions
    let searchQuery = supabase
      .from("contents")
      .select(`
        *,
        models (name),
        categories (name)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    // Apply sorting
    switch (sort) {
      case "recent":
        searchQuery = searchQuery.order("created_at", { ascending: false })
        break
      case "popular":
        searchQuery = searchQuery.order("view_count", { ascending: false })
        break
      case "title":
        searchQuery = searchQuery.order("title", { ascending: true })
        break
    }

    const { data } = await searchQuery
    results = data || []
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <SearchResults query={query} results={results} currentSort={sort} />
        </div>
      </main>
    </div>
  )
}
