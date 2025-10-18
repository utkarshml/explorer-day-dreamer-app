"use client"

import { useEffect, useState } from "react"

interface LoadingCardProps {
  text?: string
  title?: string
  showStatus?: boolean
  statusText?: string
}

export function LoadingCard({
  text = "Processing your request",
  title = "AI is thinking...",
  showStatus = true,
  statusText = "Connected",
}: LoadingCardProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    let index = 0
    const titleInterval = setInterval(() => {
      if (index <= title.length) {
        setDisplayedTitle(title.slice(0, index))
        index++
      } else {
        clearInterval(titleInterval)
      }
    }, 50)

    return () => clearInterval(titleInterval)
  }, [title])

  useEffect(() => {
    const textDelay = setTimeout(() => {
      let index = 0
      const textInterval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index))
          index++
        } else {
          clearInterval(textInterval)
        }
      }, 30)

      return () => clearInterval(textInterval)
    }, 500)

    return () => clearTimeout(textDelay)
  }, [text])

  return (
    <div className="w-full">
      {/* Animated gradient background container */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 shadow-2xl"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.8) 0%,
            rgba(59, 130, 246, 0.8) 25%,
            rgba(239, 68, 68, 0.8) 50%,
            rgba(59, 130, 246, 0.8) 75%,
            rgba(239, 68, 68, 0.8) 100%
          )`,
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
        }}
      >
        {/* Shimmer overlay effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.3) 50%,
              transparent 100%
            )`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Content container */}
        <div className="relative z-10 space-y-6">
          {/* Header with floating animation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="animate-float">
                <div className="w-3 h-3 rounded-full bg-white/80 shadow-lg" />
              </div>
              <h2
                className="text-xl font-bold text-white min-h-[1.75rem]"
                style={{
      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {displayedTitle}
                {displayedTitle.length < title.length && <span className="animate-pulse">▌</span>}
              </h2>
            </div>
            <p
              className="text-sm text-white/90 min-h-[1.25rem]"
              style={{
                fontFamily: "Poppins",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
              }}
            >
              {displayedText}
              {displayedText.length < text.length && <span className="animate-pulse">▌</span>}
            </p>
          </div>

          {/* Animated dots loader */}
          <div className="flex gap-2 items-center justify-center py-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/90"
                style={{
                  animation: `pulse-glow 1.4s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Message text with fade effect */}
          <div className="space-y-3">
            <div className="h-3 bg-white/20 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-white/20 rounded-full w-5/6 animate-pulse" />
            <div className="h-3 bg-white/20 rounded-full w-4/5 animate-pulse" />
          </div>

          {/* Glowing accent line */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 w-1/3 bg-white/60 rounded-full"
              style={{
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          {/* Status indicator */}
          {showStatus && (
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-75" />
              </div>
              <span>{statusText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Glow effect behind card */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl blur-3xl opacity-40"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.4) 0%,
            rgba(59, 130, 246, 0.4) 50%,
            rgba(239, 68, 68, 0.4) 100%
          )`,
          width: "100%",
          height: "100%",
          marginTop: "-2rem",
        }}
      />
    </div>
  )
}
