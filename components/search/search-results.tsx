"use client"

import { useRouter } from "next/navigation"
import { ContentGrid } from "@/components/content-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchResultsProps {
  query: string
  results: Array<{
    id: string
    title: string
    poster_url: string
    models: { name: string } | null
    categories: { name: string } | null
    view_count: number
  }>
  currentSort: string
}

export function SearchResults({ query, results, currentSort }: SearchResultsProps) {
  const router = useRouter()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    params.set("sort", value)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">{query ? `Search results for "${query}"` : "Search"}</h1>

        {query && (
          <p className="text-gray-400">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Filters */}
      {query && results.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Results</h2>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40 bg-[#2d2d2d] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2d2d2d] border-gray-600">
                <SelectItem value="recent" className="text-white hover:bg-gray-700">
                  Most Recent
                </SelectItem>
                <SelectItem value="popular" className="text-white hover:bg-gray-700">
                  Most Viewed
                </SelectItem>
                <SelectItem value="title" className="text-white hover:bg-gray-700">
                  Title A-Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results */}
      {query ? (
        results.length > 0 ? (
          <ContentGrid title="" content={results} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try searching with different keywords.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">Start searching</h3>
          <p className="text-gray-400">Enter a search term to find content.</p>
        </div>
      )}
    </div>
  )
}
