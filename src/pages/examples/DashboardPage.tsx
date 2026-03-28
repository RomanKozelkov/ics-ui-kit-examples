import { Card } from 'ics-ui-kit/components/card'
import { Badge } from 'ics-ui-kit/components/badge'
import { Progress } from 'ics-ui-kit/components/progress'
import { Avatar, AvatarFallback } from 'ics-ui-kit/components/avatar'
import { Icon } from 'ics-ui-kit/components/icon'
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
} from 'lucide-react'

const stats = [
  {
    label: 'Всего задач',
    value: '248',
    delta: '+12%',
    up: true,
    icon: BarChart3,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Выполнено',
    value: '183',
    delta: '+8%',
    up: true,
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'В работе',
    value: '42',
    delta: '-3%',
    up: false,
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    label: 'Просрочено',
    value: '23',
    delta: '+5%',
    up: false,
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
]

const projects = [
  { name: 'Редизайн сайта', progress: 78, status: 'info' as const, team: 4, deadline: '15 апр' },
  { name: 'Мобильное приложение', progress: 100, status: 'success' as const, team: 6, deadline: '01 апр' },
  { name: 'API интеграция', progress: 45, status: 'info' as const, team: 3, deadline: '30 апр' },
  { name: 'База данных', progress: 20, status: 'warning' as const, team: 2, deadline: '10 май' },
  { name: 'Система уведомлений', progress: 0, status: 'error' as const, team: 1, deadline: '05 апр' },
]

const activity = [
  {
    user: 'АК',
    name: 'Алиса Ковалёва',
    action: 'завершила задачу',
    target: 'Прототип главной страницы',
    time: '2 мин назад',
  },
  {
    user: 'БВ',
    name: 'Борис Волков',
    action: 'добавил комментарий в',
    target: 'API документация',
    time: '15 мин назад',
  },
  {
    user: 'МС',
    name: 'Мария Смирнова',
    action: 'создала задачу',
    target: 'Настройка CI/CD',
    time: '1 час назад',
  },
  {
    user: 'ДП',
    name: 'Дмитрий Попов',
    action: 'обновил статус',
    target: 'Редизайн сайта',
    time: '3 часа назад',
  },
]

const members = [
  { initials: 'АК', name: 'Алиса Ковалёва', role: 'Дизайнер', tasks: 12, done: 9 },
  { initials: 'БВ', name: 'Борис Волков', role: 'Разработчик', tasks: 18, done: 14 },
  { initials: 'МС', name: 'Мария Смирнова', role: 'Менеджер', tasks: 8, done: 7 },
  { initials: 'ДП', name: 'Дмитрий Попов', role: 'DevOps', tasks: 10, done: 6 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Дашборд проекта</h1>
          <p className="text-sm text-gray-500 mt-1">Обзор всех задач и активности команды</p>
        </div>
        <Badge status="info" size="md">
          <Icon icon={Activity} />
          Активен
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Icon icon={stat.up ? TrendingUp : TrendingDown} className={`w-3.5 h-3.5 ${stat.up ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.delta}
                  </span>
                  <span className="text-xs text-gray-400">за месяц</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects Progress */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base">Проекты</h2>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge status={project.status} size="sm">
                      {project.progress === 100
                        ? 'Готово'
                        : project.status === 'warning'
                          ? 'Под угрозой'
                          : project.status === 'error'
                            ? 'Просрочено'
                            : 'В работе'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{project.deadline}</span>
                    <span>{project.progress}%</span>
                  </div>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h2 className="font-semibold text-base mb-5">Активность</h2>
          <div className="space-y-4">
            {activity.map((item, i) => (
              <div key={i} className="flex gap-3">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs">{item.user}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.name}</span>{' '}
                    <span className="text-gray-500">{item.action}</span>{' '}
                    <span className="font-medium">{item.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="p-5">
        <h2 className="font-semibold text-base mb-5">Команда</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <div key={member.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="text-sm font-medium">{member.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
                <div className="mt-1.5">
                  <Progress value={Math.round((member.done / member.tasks) * 100)} className="h-1.5" />
                  <p className="text-xs text-gray-400 mt-1">{member.done}/{member.tasks} задач</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
