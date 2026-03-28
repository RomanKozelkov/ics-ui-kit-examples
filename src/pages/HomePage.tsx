import { Link } from 'react-router'
import { Card } from 'ics-ui-kit/components/card'
import { Badge } from 'ics-ui-kit/components/badge'
import { Icon } from 'ics-ui-kit/components/icon'
import { LogIn, UserPlus, LayoutDashboard, Table2 } from 'lucide-react'

const examples = [
  {
    path: '/examples/login-form',
    title: 'Форма входа',
    description: 'Форма аутентификации с email, паролем и валидацией через Zod',
    icon: LogIn,
    badge: 'Форма',
    status: 'success' as const,
  },
  {
    path: '/examples/registration-form',
    title: 'Форма регистрации',
    description: 'Многосекционная форма с полями, выбором роли и подтверждением пароля',
    icon: UserPlus,
    badge: 'Форма',
    status: 'success' as const,
  },
  {
    path: '/examples/dashboard',
    title: 'Дашборд',
    description: 'Обзор проекта: статистика, прогресс задач, активность команды',
    icon: LayoutDashboard,
    badge: 'Дашборд',
    status: 'info' as const,
  },
  {
    path: '/examples/data-grid',
    title: 'Таблица задач',
    description: 'Дата-грид с сортировкой, поиском и контекстным меню на каждой строке',
    icon: Table2,
    badge: 'Таблица',
    status: 'warning' as const,
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ICS UI Kit — Примеры</h1>
        <p className="text-gray-500 mt-2">
          Интерактивные примеры компонентов из библиотеки{' '}
          <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">ics-ui-kit@alpha</code>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {examples.map((ex) => (
          <Link key={ex.path} to={ex.path} className="group block">
            <Card className="p-6 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <Icon icon={ex.icon} className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-gray-900">{ex.title}</h2>
                    <Badge status={ex.status} size="sm">{ex.badge}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{ex.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
