"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ContentItem {
  id: string
  title: string
  poster_url: string
  models: { name: string } | null
  categories: { name: string } | null
  view_count: number
}

interface ContentGridProps {
  title: string
  content: ContentItem[]
  className?: string
}

export function ContentGrid({ title, content, className }: ContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <section className={cn("container mx-auto px-4", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {content.map((item) => (
          <div
            key={item.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link href={`/content/${item.id}`}>
              {/* Content Card */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#2d2d2d] transition-transform duration-300 group-hover:scale-105">
                <img
                  src={item.poster_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300",
                    hoveredItem === item.id && "opacity-100",
                  )}
                >
                  <Play className="h-12 w-12 text-white fill-current" />
                </div>

                {/* Category Badge */}
                {item.categories && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#f40088] text-white text-xs font-medium rounded">
                    {item.categories.name}
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="mt-3 space-y-1">
                <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-[#f40088] transition-colors">
                  {item.title}
                </h3>

                {item.models && <p className="text-gray-400 text-xs">{item.models.name}</p>}

                <p className="text-gray-500 text-xs">{item.view_count.toLocaleString()} views</p>
              </div>
            </Link>

            {/* Quick Actions (Desktop Only) */}
            <div
              className={cn(
                "absolute top-2 right-2 flex flex-col gap-1 opacity-0 transition-opacity duration-300",
                hoveredItem === item.id && "opacity-100",
              )}
            >
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-[#f40088] text-white">
                <Plus className="h-4 w-4" />
              </Button>

              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-[#f40088] text-white">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
