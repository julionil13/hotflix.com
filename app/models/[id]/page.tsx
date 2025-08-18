import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { ModelProfile } from "@/components/models/model-profile"
import { ContentGrid } from "@/components/content-grid"

interface ModelPageProps {
  params: {
    id: string
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const supabase = createClient()

  // Get model details
  const { data: model, error } = await supabase.from("models").select("*").eq("id", params.id).single()

  if (error || !model) {
    notFound()
  }

  // Get all content from this model
  const { data: modelContent } = await supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .eq("model_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="pt-16">
        {/* Model Profile */}
        <ModelProfile model={model} contentCount={modelContent?.length || 0} />

        {/* Model's Content */}
        <div className="container mx-auto px-4 py-12">
          {modelContent && modelContent.length > 0 ? (
            <ContentGrid title={`All content by ${model.name}`} content={modelContent} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No content available</h3>
              <p className="text-gray-400">This model hasn't published any content yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
