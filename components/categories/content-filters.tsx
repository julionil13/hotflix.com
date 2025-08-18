"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContentFiltersProps {
  currentSort: string
  categorySlug: string
}

export function ContentFilters({ currentSort, categorySlug }: ContentFiltersProps) {
  const router = useRouter()

  const handleSortChange = (value: string) => {
    router.push(`/categories/${categorySlug}?sort=${value}`)
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">All Content</h2>

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
  )
}
