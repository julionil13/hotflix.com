"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Video, UserCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Content", href: "/admin/content", icon: Video },
  { name: "Models", href: "/admin/models", icon: UserCheck },
  { name: "Users", href: "/admin/users", icon: Users },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-[#2d2d2d] border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="text-2xl font-black text-[#f40088]">HOTFLIX</div>
            <span className="text-gray-400 text-sm">Admin</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-[#f40088] text-white" : "text-gray-300 hover:text-white hover:bg-gray-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                View Site
              </Button>
            </Link>

            <form action={signOut}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
