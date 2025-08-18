"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward } from "lucide-react"

interface VideoPlayerControlsProps {
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  progress: number[]
  volume: number[]
  currentTime: number
  duration: number
  onPlayPause: () => void
  onMute: () => void
  onFullscreen: () => void
  onProgressChange: (value: number[]) => void
  onVolumeChange: (value: number[]) => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onSettings: () => void
  formatTime: (time: number) => string
}

export function VideoPlayerControls({
  isPlaying,
  isMuted,
  isFullscreen,
  progress,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onMute,
  onFullscreen,
  onProgressChange,
  onVolumeChange,
  onSkipForward,
  onSkipBackward,
  onSettings,
  formatTime,
}: VideoPlayerControlsProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        {/* Progress Bar */}
        <Slider
          value={progress}
          onValueChange={onProgressChange}
          max={100}
          step={0.1}
          className="w-full cursor-pointer"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onPlayPause} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={onSkipBackward} className="text-white hover:bg-white/20">
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onSkipForward} className="text-white hover:bg-white/20">
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <Slider value={volume} onValueChange={onVolumeChange} max={100} step={1} className="w-24" />
            </div>

            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onSettings} className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onFullscreen} className="text-white hover:bg-white/20">
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
