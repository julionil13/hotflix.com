import { ContentGrid } from "@/components/content-grid"
import { cn } from "@/lib/utils"

interface RelatedContentProps {
  content: Array<{
    id: string
    title: string
    poster_url: string
    models: { name: string } | null
    categories: { name: string } | null
    view_count: number
  }>
  className?: string
}

export function RelatedContent({ content, className }: RelatedContentProps) {
  return (
    <div className={cn("", className)}>
      <ContentGrid title="Related Content" content={content} />
    </div>
  )
}
