import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria um cliente Supabase que funciona no lado do servidor (server-side).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Obtém a sessão do utilizador para verificar se ele está logado.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // --- LÓGICA DE SEGURANÇA ADICIONADA ---
  // Se o utilizador NÃO estiver logado E estiver a tentar aceder a uma página protegida...
  if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/my-account'))) {
    // ...redireciona-o para a página inicial para que ele possa fazer o login.
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Se o utilizador estiver logado ou a aceder a uma página pública, permite que ele continue.
  return response
}

// Configuração que diz ao middleware em que páginas ele deve ser executado.
export const config = {
  matcher: [
    /*
     * Faz a correspondência com todos os caminhos de pedido, exceto os que começam por:
     * - _next/static (ficheiros estáticos)
     * - _next/image (ficheiros de otimização de imagem)
     * - favicon.ico (ficheiro favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
