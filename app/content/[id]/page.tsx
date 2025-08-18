import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ContentPlayer } from "@/components/content/content-player"
import { ContentInfo } from "@/components/content/content-info"
import { RelatedContent } from "@/components/content/related-content"
import { Header } from "@/components/header"

interface ContentPageProps {
  params: {
    id: string
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const supabase = createClient()

  // Get the content details
  const { data: content, error } = await supabase
    .from("contents")
    .select(`
      *,
      models (id, name, bio, profile_image_url),
      categories (id, name, slug)
    `)
    .eq("id", params.id)
    .single()

  if (error || !content) {
    notFound()
  }

  // Get related content (same category, excluding current)
  const { data: relatedContent } = await supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .eq("category_id", content.category_id)
    .neq("id", params.id)
    .limit(8)

  // Increment view count
  await supabase
    .from("contents")
    .update({ view_count: content.view_count + 1 })
    .eq("id", params.id)

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="pt-16">
        {/* Video Player Section */}
        <ContentPlayer content={content} />

        {/* Content Information */}
        <div className="container mx-auto px-4 py-8">
          <ContentInfo content={content} />

          {/* Related Content */}
          {relatedContent && relatedContent.length > 0 && <RelatedContent content={relatedContent} className="mt-12" />}
        </div>
      </main>
    </div>
  )
}
