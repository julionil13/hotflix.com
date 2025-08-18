"use client"

import { Play, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  content: {
    id: string
    title: string
    description: string
    poster_url: string
    models: { name: string; profile_image_url: string } | null
    categories: { name: string } | null
  }
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${content.poster_url})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-16">
        <div className="max-w-2xl">
          {/* Category Badge */}
          {content.categories && (
            <div className="inline-block px-3 py-1 bg-[#f40088] text-white text-sm font-medium rounded-full mb-4">
              {content.categories.name}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{content.title}</h1>

          {/* Model Name */}
          {content.models && <p className="text-lg text-[#f40088] font-medium mb-4">Featuring {content.models.name}</p>}

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">{content.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 text-lg">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Watch Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 text-white hover:bg-white hover:text-black font-semibold px-8 py-3 text-lg bg-transparent"
            >
              <Plus className="h-5 w-5 mr-2" />
              My List
            </Button>

            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg">
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
