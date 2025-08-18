"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Plus, Share2, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ContentInfoProps {
  content: {
    id: string
    title: string
    description: string
    view_count: number
    created_at: string
    models: { id: string; name: string; bio: string; profile_image_url: string } | null
    categories: { id: string; name: string; slug: string } | null
  }
}

export function ContentInfo({ content }: ContentInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isInList, setIsInList] = useState(false)

  return (
    <div className="space-y-6">
      {/* Title and Category */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {content.categories && (
            <Badge className="bg-[#f40088] text-white hover:bg-[#d1006f]">{content.categories.name}</Badge>
          )}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Eye className="h-4 w-4" />
            {content.view_count.toLocaleString()} views
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="h-4 w-4" />
            {new Date(content.created_at).toLocaleDateString()}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white">{content.title}</h1>
      </div>

      {/* Model Information */}
      {content.models && (
        <div className="flex items-center gap-4">
          <img
            src={content.models.profile_image_url || "/placeholder.svg"}
            alt={content.models.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <Link
              href={`/models/${content.models.id}`}
              className="text-[#f40088] hover:text-[#d1006f] font-medium text-lg transition-colors"
            >
              {content.models.name}
            </Link>
            <p className="text-gray-400 text-sm">Featured Model</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setIsInList(!isInList)}
          variant={isInList ? "default" : "outline"}
          className={
            isInList
              ? "bg-[#f40088] hover:bg-[#d1006f] text-white"
              : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          {isInList ? "In My List" : "Add to My List"}
        </Button>

        <Button
          onClick={() => setIsLiked(!isLiked)}
          variant="outline"
          className={`border-gray-600 hover:bg-gray-800 bg-transparent ${
            isLiked ? "text-[#f40088] border-[#f40088]" : "text-white"
          }`}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
          Like
        </Button>

        <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">About</h3>
        <p className="text-gray-300 leading-relaxed max-w-4xl">{content.description}</p>
      </div>
    </div>
  )
}
