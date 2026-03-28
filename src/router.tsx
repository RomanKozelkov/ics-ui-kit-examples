import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ComponentPage from './pages/ComponentPage'
import LoginFormPage from './pages/examples/LoginFormPage'
import RegistrationFormPage from './pages/examples/RegistrationFormPage'
import DashboardPage from './pages/examples/DashboardPage'
import DataGridPage from './pages/examples/DataGridPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/category/:slug', element: <CategoryPage /> },
      { path: '/component/:slug', element: <ComponentPage /> },
      { path: '/examples/login-form', element: <LoginFormPage /> },
      { path: '/examples/registration-form', element: <RegistrationFormPage /> },
      { path: '/examples/dashboard', element: <DashboardPage /> },
      { path: '/examples/data-grid', element: <DataGridPage /> },
    ],
  },
])

export default router
