interface ModelProfileProps {
  model: {
    id: string
    name: string
    bio: string
    profile_image_url: string
  }
  contentCount: number
}

export function ModelProfile({ model, contentCount }: ModelProfileProps) {
  return (
    <div className="relative">
      {/* Background Banner */}
      <div className="h-64 md:h-80 bg-gradient-to-r from-[#f40088]/20 to-[#141414] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 relative -mt-32">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={model.profile_image_url || "/placeholder.svg"}
              alt={model.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#141414] shadow-xl"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4 pb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{model.name}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span>{contentCount} videos</span>
                <span>•</span>
                <span>Featured Model</span>
              </div>
            </div>

            {/* Bio */}
            {model.bio && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300 leading-relaxed">{model.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
