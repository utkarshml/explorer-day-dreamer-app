"use client"

import type React from "react"
import { useEffect, useRef, forwardRef } from "react"

import { cn } from "@/lib/utils"
import { Link } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...props}>
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NavItem(
  {
    href,
    children,
    onClick,
  }: {
    href: string
    children: React.ReactNode
    onClick?: () => void
  },
  ref: React.Ref<HTMLAnchorElement>,
) {
  const {pathname} = useLocation()
  const active = pathname === href
  return (
    <Link    
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </Link>
  )
}
const ForwardNavItem = forwardRef<HTMLAnchorElement, { href: string; children: React.ReactNode; onClick?: () => void }>(
  NavItem,
)

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", onKey)
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", onKey)
        document.body.style.overflow = prev
      }
    }
  }, [open, onClose])

  useEffect(() => {
    if (open && firstLinkRef.current) {
      firstLinkRef.current.focus()
    }
  }, [open])

  return (
    <div aria-hidden={!open} className={cn("pointer-events-none fixed inset-0 z-50", open && "pointer-events-auto")}>
      {/* Overlay */}
      <div
        role="presentation"
        className={cn("absolute inset-0 bg-foreground/30 opacity-0 transition-opacity", open && "opacity-100")}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={cn(
          "absolute left-0 top-0 h-full w-80 max-w-[85vw] translate-x-[-100%] border-r bg-sidebar text-sidebar-foreground shadow-xl transition-transform",
          open && "translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              T
            </span>
            <span className="text-sm font-semibold">TripCraft</span>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-secondary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="px-2 py-3">
          <ForwardNavItem href="/" onClick={onClose} ref={firstLinkRef}>
            Home
          </ForwardNavItem>
          <ForwardNavItem href="/itineraries" onClick={onClose}>
            Itineraries
          </ForwardNavItem>
        </nav>

        {/* Special/creative touch: subtle info block */}
        <div className="mt-auto px-4 py-3">
          <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground">
            {"Plan smart. Travel better."}
          </div>
        </div>
      </aside>
    </div>
  )
}
