"use client"

import type React from "react"

import { useState } from "react"
import { MobileDrawer } from "./mobile-drawer"
import { Link } from "react-router-dom"

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-drawer" // link control to drawer for a11y and assistive tech
            onClick={() => {
              // console.log("[v0] Opening mobile drawer") // remove after debugging if added
              setOpen(true)
            }}
            className="inline-flex lg:hidden  h-9 w-9 items-center justify-center rounded-md border bg-primary  text-secondary-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MenuIcon />
            <span className="sr-only">Open navigation</span>
          </button>

          <Link to="/" className="inline-flex items-center gap-2">
            {/* Simple logo mark + wordmark */}
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
            >
              AI
            </span>
            <span className="text-sm font-medium tracking-wide text-foreground">Margdarshak</span>
          </Link>
 
          <div className="h-9 w-9" aria-hidden="true" />
                   {/* Right spacer for symmetry */}
            <div className=" hidden lg:flex max-w-6xl items-center justify-end space-x-4 px-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground">
              About
              </Link>
          </div>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      {/* Reserve header height */}
      <div className="h-14" aria-hidden="true" />
    </>
  )
}
