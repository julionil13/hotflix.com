interface CategoryHeaderProps {
  category: {
    id: string
    name: string
    slug: string
  }
  contentCount: number
}

export function CategoryHeader({ category, contentCount }: CategoryHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#f40088]/20 to-[#141414] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-lg text-gray-300 mb-6">
            Discover premium content in the {category.name.toLowerCase()} category
          </p>
          <div className="text-gray-400">
            {contentCount} video{contentCount !== 1 ? "s" : ""} available
          </div>
        </div>
      </div>
    </div>
  )
}
