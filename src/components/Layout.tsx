import { Link, Outlet, useLocation } from 'react-router'
import { ChevronLeft } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </Link>
          )}
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            ICS UI Kit Examples
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
