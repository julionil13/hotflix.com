"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Lock, SkipBack, SkipForward, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessRequiredModal } from "@/components/payment/access-required-modal"
import { PaymentModal } from "@/components/payment/payment-modal"
import { supabase } from "@/lib/supabase/client"

interface ContentPlayerProps {
  content: {
    id: string
    title: string
    video_url: string
    poster_url: string
  }
}

const plans = [
  {
    id: "monthly",
    name: "Monthly Pass",
    price: "R$ 29,90",
    priceValue: 29.9,
    description: "Full access to all premium content",
    features: ["Unlimited streaming", "HD quality videos", "All exclusive content", "Mobile & desktop access"],
    popular: false,
    durationDays: 30,
  },
]

export function ContentPlayer({ content }: ContentPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState([0])
  const [volume, setVolume] = useState([100])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [playbackRate, setPlaybackRate] = useState("1")
  const [quality, setQuality] = useState("auto")
  const [showSettings, setShowSettings] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [showAccessRequired, setShowAccessRequired] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [user, setUser] = useState(null)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: userData } = await supabase.from("users").select("access_expires_at").eq("id", user.id).single()

        if (userData?.access_expires_at) {
          const expiresAt = new Date(userData.access_expires_at)
          setHasAccess(expiresAt > new Date())
        }
      }
    }

    checkAccess()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress([(video.currentTime / video.duration) * 100])
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)

    const handleEnded = () => {
      setIsPlaying(false)
      // Auto-play next content logic could go here
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("ended", handleEnded)
    }
  }, [hasAccess])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!hasAccess || !videoRef.current) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlayPause()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipBackward()
          break
        case "ArrowRight":
          e.preventDefault()
          skipForward()
          break
        case "ArrowUp":
          e.preventDefault()
          adjustVolume(10)
          break
        case "ArrowDown":
          e.preventDefault()
          adjustVolume(-10)
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [hasAccess, isPlaying, isMuted])

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    setShowControls(true)

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const togglePlayPause = () => {
    if (!videoRef.current || !hasAccess) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
    resetControlsTimeout()
  }

  const handlePlayClick = () => {
    if (!user) {
      // Redirect to login
      return
    }

    if (!hasAccess) {
      setShowAccessRequired(true)
      return
    }

    togglePlayPause()
  }

  const skipForward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
  }

  const skipBackward = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
  }

  const handleProgressChange = (value: number[]) => {
    if (!videoRef.current) return
    const newTime = (value[0] / 100) * duration
    videoRef.current.currentTime = newTime
    setProgress(value)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const adjustVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume[0] + delta))
    setVolume([newVolume])
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
      videoRef.current.muted = value[0] === 0
      setIsMuted(value[0] === 0)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handlePlaybackRateChange = (rate: string) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = Number.parseFloat(rate)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProceedToPayment = () => {
    setShowAccessRequired(false)
    setShowPayment(true)
  }

  const handleCloseModals = () => {
    setShowAccessRequired(false)
    setShowPayment(false)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="relative bg-black"
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <div className="aspect-video relative group">
          {hasAccess ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={content.poster_url}
              preload="metadata"
              onClick={togglePlayPause}
            >
              <source src={content.video_url || "/placeholder-video.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.poster_url})` }}
            />
          )}

          {/* Access Overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Lock className="h-16 w-16 text-[#f40088] mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Premium Content</h3>
                  <p className="text-gray-300">Get access to watch this exclusive content</p>
                </div>
                <Button
                  onClick={() => setShowAccessRequired(true)}
                  className="bg-[#f40088] hover:bg-[#d1006f] text-white px-8 py-3"
                >
                  Get Access
                </Button>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && hasAccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 border-4 border-[#f40088] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && hasAccess && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                onClick={handlePlayClick}
                className="bg-[#f40088] hover:bg-[#d1006f] text-white rounded-full w-20 h-20 p-0 transition-transform hover:scale-110"
              >
                <Play className="h-8 w-8 ml-1 fill-current" />
              </Button>
            </div>
          )}

          {/* Video Controls */}
          {showControls && hasAccess && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">{content.title}</h3>

                  {/* Settings Menu */}
                  {showSettings && (
                    <div className="absolute top-12 right-0 bg-black/90 rounded-lg p-4 space-y-4 min-w-48">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Playback Speed</label>
                        <Select value={playbackRate} onValueChange={handlePlaybackRateChange}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="0.5" className="text-white">
                              0.5x
                            </SelectItem>
                            <SelectItem value="0.75" className="text-white">
                              0.75x
                            </SelectItem>
                            <SelectItem value="1" className="text-white">
                              Normal
                            </SelectItem>
                            <SelectItem value="1.25" className="text-white">
                              1.25x
                            </SelectItem>
                            <SelectItem value="1.5" className="text-white">
                              1.5x
                            </SelectItem>
                            <SelectItem value="2" className="text-white">
                              2x
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Quality</label>
                        <Select value={quality} onValueChange={setQuality}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="auto" className="text-white">
                              Auto
                            </SelectItem>
                            <SelectItem value="1080p" className="text-white">
                              1080p HD
                            </SelectItem>
                            <SelectItem value="720p" className="text-white">
                              720p
                            </SelectItem>
                            <SelectItem value="480p" className="text-white">
                              480p
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                {/* Progress Bar */}
                <Slider
                  value={progress}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="w-full cursor-pointer"
                />

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={skipBackward} className="text-white hover:bg-white/20">
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={skipForward} className="text-white hover:bg-white/20">
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>

                      <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="w-24" />
                    </div>

                    <span className="text-white text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modals */}
      <AccessRequiredModal
        isOpen={showAccessRequired}
        onClose={handleCloseModals}
        onProceed={handleProceedToPayment}
        plan={plans[0]}
      />

      <PaymentModal isOpen={showPayment} onClose={handleCloseModals} plan={plans[0]} />
    </>
  )
}
