import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Role to allowed paths mapping
const roleRoutes: Record<string, string[]> = {
  admin: ['/admin', '/dashboard'],
  executive_officer: ['/executive', '/dashboard'],
  hr: ['/hr', '/dashboard'],
  manager: ['/manager', '/dashboard'],
  team_lead: ['/team-lead', '/dashboard'],
  senior_developer: ['/developer', '/dashboard'],
  junior_developer: ['/developer', '/dashboard'],
  intern: ['/intern', '/dashboard'],
  marketing: ['/marketing', '/dashboard'],
}

const publicRoutes = ['/login', '/', '/solutions', '/work', '/open-source', '/about', '/contact', '/legal', '/request-quote']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (publicRoutes.includes(pathname)) {
    return supabaseResponse
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Get user role from profiles table (requires Supabase to be setup properly)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'intern' // Default fallback

  const allowedRoutes = roleRoutes[userRole] || []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess && !publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Fallback to a safe route, or role specific route
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
