"use client"

import { useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { Search, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/auth/login-modal"
import { SignUpModal } from "@/components/auth/signup-modal"
import { useMobile } from "@/hooks/use-mobile"

// CORREÇÃO: O componente agora recebe a sessão como uma propriedade (prop).
interface HeaderProps {
  session: Session | null
}

export function Header({ session }: HeaderProps) {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignUpOpen, setSignUpOpen] = useState(false)
  const router = useRouter()
  const isMobile = useMobile()
  const supabase = createClientComponentClient()

  // Usamos a sessão recebida para determinar o estado do utilizador.
  const user = session?.user

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const navLinks = [
    { href: "/models", label: "Modelos" },
    { href: "/categories", label: "Categoria" },
    { href: "/trending", label: "Bombando" },
    { href: "/#assinatura", label: "Assinatura" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-3xl font-black text-[#f40088] tracking-wider">
              HOTFLIX
            </Link>
            {!isMobile && (
              <nav className="flex items-center space-x-5 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="pl-10 bg-[#2d2d2d] border-gray-700 rounded-md"
              />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push("/my-account")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Minha Conta</span>
                  </DropdownMenuItem>
                  {/* A verificação de admin ainda precisa ser implementada com base no teu DB */}
                  {/* <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setLoginOpen(true)} className="bg-[#f40088] hover:bg-[#d1006f]">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignUp={() => {
          setLoginOpen(false)
          setSignUpOpen(true)
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToLogin={() => {
          setSignUpOpen(false)
          setLoginOpen(true)
        }}
      />
    </>
  )
}
