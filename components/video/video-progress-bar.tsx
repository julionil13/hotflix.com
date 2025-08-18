"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

interface VideoProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

export function VideoProgressBar({ currentTime, duration, onSeek, className }: VideoProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewTime, setPreviewTime] = useState(0)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    onSeek(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={`relative group ${className}`}>
      <Slider
        value={[progress]}
        onValueChange={handleProgressChange}
        max={100}
        step={0.1}
        className="w-full cursor-pointer"
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      />

      {/* Time tooltip on hover */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatTime(previewTime)}
        </div>
      )}
    </div>
  )
}
