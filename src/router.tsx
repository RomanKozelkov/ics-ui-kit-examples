import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ComponentPage from './pages/ComponentPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/category/:slug', element: <CategoryPage /> },
      { path: '/component/:slug', element: <ComponentPage /> },
    ],
  },
])

export default router
