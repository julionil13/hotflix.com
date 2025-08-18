"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginModal } from "@/components/auth/login-modal"
import { SignUpModal } from "@/components/auth/signup-modal"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSwitchToSignUp = () => {
    setIsLoginOpen(false)
    setIsSignUpOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignUpOpen(false)
    setIsLoginOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-black text-[#f40088]">HOTFLIX</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/models" className="text-white hover:text-[#f40088] transition-colors">
                Models
              </Link>
              <Link href="/categories" className="text-white hover:text-[#f40088] transition-colors">
                Categories
              </Link>
              <Link href="/trending" className="text-white hover:text-[#f40088] transition-colors">
                Trending
              </Link>
              <Link href="/subscription" className="text-white hover:text-[#f40088] transition-colors">
                Subscription
              </Link>
            </nav>

            {/* Search and Profile */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center">
                {isSearchOpen ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search content..."
                      className="w-64 bg-[#2d2d2d] border-gray-600 text-white placeholder:text-gray-400"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Profile/Auth */}
              {user ? (
                <Link href="/my-account">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <Input
                  type="text"
                  placeholder="Search content..."
                  className="bg-[#2d2d2d] border-gray-600 text-white placeholder:text-gray-400"
                />

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3">
                  <Link href="/models" className="text-white hover:text-[#f40088] transition-colors">
                    Models
                  </Link>
                  <Link href="/categories" className="text-white hover:text-[#f40088] transition-colors">
                    Categories
                  </Link>
                  <Link href="/trending" className="text-white hover:text-[#f40088] transition-colors">
                    Trending
                  </Link>
                  <Link href="/subscription" className="text-white hover:text-[#f40088] transition-colors">
                    Subscription
                  </Link>

                  {user ? (
                    <Link href="/my-account" className="text-white hover:text-[#f40088] transition-colors">
                      My Account
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="text-white hover:text-[#f40088] transition-colors text-left"
                    >
                      Sign In
                    </button>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToSignUp={handleSwitchToSignUp} />

      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
    </>
  )
}
