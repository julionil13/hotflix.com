import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ContentGrid } from "@/components/content-grid"
import { AccessPlans } from "@/components/access-plans"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const supabase = createClient()

  // Get featured content for hero section
  const { data: featuredContent } = await supabase
    .from("contents")
    .select(`
      *,
      models (name, profile_image_url),
      categories (name)
    `)
    .eq("is_featured", true)
    .limit(1)
    .single()

  // Get trending content
  const { data: trendingContent } = await supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .order("view_count", { ascending: false })
    .limit(8)

  // Get new releases
  const { data: newReleases } = await supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .order("created_at", { ascending: false })
    .limit(8)

  // Get popular content
  const { data: popularContent } = await supabase
    .from("contents")
    .select(`
      *,
      models (name),
      categories (name)
    `)
    .order("view_count", { ascending: false })
    .range(8, 15)

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      {featuredContent && <HeroSection content={featuredContent} />}

      <main className="pb-20">
        {trendingContent && trendingContent.length > 0 && (
          <ContentGrid title="Trending Now" content={trendingContent} className="mt-8" />
        )}

        {newReleases && newReleases.length > 0 && (
          <ContentGrid title="New Releases" content={newReleases} className="mt-12" />
        )}

        {popularContent && popularContent.length > 0 && (
          <ContentGrid title="Popular This Week" content={popularContent} className="mt-12" />
        )}

        <AccessPlans className="mt-16" />
      </main>

      <Footer />
    </div>
  )
}
