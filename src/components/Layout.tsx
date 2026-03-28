import { Link, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
