"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationResult {
  place_id: string
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
}

interface AddressAutocompleteProps {
  onAddressSelect?: (address: LocationResult , tag: string) => void
  placeholder?: string
  className?: string
  apiKey?: string
  tag : string
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Enter an address...",
  className,
  tag,
  apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Add minimum query length and request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounced search function with optimizations
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Minimum 3 characters before searching
      if (!searchQuery.trim() || searchQuery.length < 3 || !apiKey) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      setError(null)

      // Create new abort controller
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=8&dedupe=1&addressdetails=1&normalizecity=1&tag=place:house,place:building,highway:residential,highway:primary,highway:secondary,highway:tertiary,place:suburb,place:neighbourhood,place:city,place:town,place:village`,
          {
            signal: abortControllerRef.current.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        // Filter out pins, POIs, and non-address results
        const filteredResults = (data || []).filter((item: LocationResult) => {
          const displayName = item.display_name.toLowerCase()
          const type = item.type?.toLowerCase() || ""

          // Exclude common POI types
          const excludeTypes = [
            "amenity",
            "shop",
            "tourism",
            "leisure",
            "historic",
            "natural",
            "landuse",
            "railway",
            "aeroway",
            "waterway",
          ]

          // Exclude if it's a POI type
          if (excludeTypes.some((excludeType) => type.includes(excludeType))) {
            return false
          }

          // Exclude common business/POI keywords
          const excludeKeywords = [
            "restaurant",
            "hotel",
            "store",
            "shop",
            "mall",
            "center",
            "hospital",
            "school",
            "university",
            "church",
            "mosque",
            "temple",
            "park",
            "museum",
            "library",
            "station",
            "airport",
          ]

          if (excludeKeywords.some((keyword) => displayName.includes(keyword))) {
            return false
          }

          return true
        })

        setSuggestions(filteredResults.slice(0, 5)) // Limit to 5 results
        setIsOpen(filteredResults.length > 0)
        setSelectedIndex(-1)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, ignore
          return
        }
        setError(err instanceof Error ? err.message : "Failed to fetch suggestions")
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 500), // Increased debounce to 500ms
    [apiKey],
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Clear suggestions if less than minimum characters
    if (value.length < 3) {
      setSuggestions([])
      setIsOpen(false)
      setError(null)
    }
  }

  const handleSuggestionClick = (suggestion: LocationResult) => {
    setQuery(suggestion.display_name)
    setSuggestions([])
    setIsOpen(false)
    onAddressSelect?.(suggestion ,tag)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const clearInput = () => {
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    setError(null)
    inputRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!apiKey) {
    return (
      <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">
        Please set NEXT_PUBLIC_LOCATIONIQ_API_KEY environment variable
      </div>
    )
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        {query.length > 0 && query.length < 3 && (
          <div className="mt-1 text-xs text-gray-500">Type at least 3 characters to search for addresses</div>
        )}
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearInput}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}

      {isOpen && suggestions.length > 0 && (
        <Card ref={suggestionsRef} className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <div role="listbox" className="py-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                role="option"
                aria-selected={index === selectedIndex}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 flex items-start gap-2",
                  index === selectedIndex && "bg-gray-100",
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{suggestion.display_name.split(",")[0]}</div>
                  <div className="text-gray-500 text-xs truncate">{suggestion.display_name}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
