import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'ics-ui-kit/components/table'
import { Badge } from 'ics-ui-kit/components/badge'
import { Button } from 'ics-ui-kit/components/button'
import { IconButton } from 'ics-ui-kit/components/button'
import { Icon } from 'ics-ui-kit/components/icon'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'ics-ui-kit/components/dropdown'
import { Avatar, AvatarFallback } from 'ics-ui-kit/components/avatar'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  UserPlus,
  Download,
  Search,
  ArrowUpDown,
} from 'lucide-react'
import { TextInput } from 'ics-ui-kit/components/input'

type TaskStatus = 'completed' | 'in_progress' | 'review' | 'blocked'
type Priority = 'high' | 'medium' | 'low'

interface Task {
  id: string
  title: string
  owner: string
  ownerInitials: string
  project: string
  status: TaskStatus
  priority: Priority
  dueDate: string
}

const initialTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Редизайн главной страницы',
    owner: 'Алиса Ковалёва',
    ownerInitials: 'АК',
    project: 'Сайт',
    status: 'in_progress',
    priority: 'high',
    dueDate: '15 апр 2026',
  },
  {
    id: 'TSK-002',
    title: 'Настройка CI/CD пайплайна',
    owner: 'Дмитрий Попов',
    ownerInitials: 'ДП',
    project: 'DevOps',
    status: 'review',
    priority: 'high',
    dueDate: '10 апр 2026',
  },
  {
    id: 'TSK-003',
    title: 'Написать unit-тесты для API',
    owner: 'Борис Волков',
    ownerInitials: 'БВ',
    project: 'Backend',
    status: 'completed',
    priority: 'medium',
    dueDate: '01 апр 2026',
  },
  {
    id: 'TSK-004',
    title: 'Обновить документацию',
    owner: 'Мария Смирнова',
    ownerInitials: 'МС',
    project: 'Сайт',
    status: 'blocked',
    priority: 'low',
    dueDate: '20 апр 2026',
  },
  {
    id: 'TSK-005',
    title: 'Интеграция с платёжной системой',
    owner: 'Борис Волков',
    ownerInitials: 'БВ',
    project: 'Backend',
    status: 'in_progress',
    priority: 'high',
    dueDate: '30 апр 2026',
  },
  {
    id: 'TSK-006',
    title: 'Мобильная адаптация каталога',
    owner: 'Алиса Ковалёва',
    ownerInitials: 'АК',
    project: 'Мобайл',
    status: 'completed',
    priority: 'medium',
    dueDate: '05 апр 2026',
  },
  {
    id: 'TSK-007',
    title: 'Оптимизация запросов к БД',
    owner: 'Дмитрий Попов',
    ownerInitials: 'ДП',
    project: 'Backend',
    status: 'review',
    priority: 'medium',
    dueDate: '25 апр 2026',
  },
  {
    id: 'TSK-008',
    title: 'Дизайн системы уведомлений',
    owner: 'Мария Смирнова',
    ownerInitials: 'МС',
    project: 'Сайт',
    status: 'blocked',
    priority: 'low',
    dueDate: '12 май 2026',
  },
]

const statusConfig: Record<TaskStatus, { label: string; badge: 'default' | 'info' | 'success' | 'warning' | 'error' }> = {
  completed: { label: 'Выполнено', badge: 'success' },
  in_progress: { label: 'В работе', badge: 'info' },
  review: { label: 'На ревью', badge: 'warning' },
  blocked: { label: 'Заблокировано', badge: 'error' },
}

const priorityConfig: Record<Priority, { label: string; cls: string }> = {
  high: { label: 'Высокий', cls: 'text-red-600 bg-red-50' },
  medium: { label: 'Средний', cls: 'text-orange-600 bg-orange-50' },
  low: { label: 'Низкий', cls: 'text-gray-600 bg-gray-100' },
}

type SortKey = 'title' | 'owner' | 'project' | 'status' | 'priority' | 'dueDate'

export default function DataGridPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed' as TaskStatus } : t))
    )
  }

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.owner.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    : filtered

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Список задач</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sorted.length} из {initialTasks.length} задач
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icon icon={Download} />
            Экспорт
          </Button>
          <Button size="sm">
            <Icon icon={UserPlus} />
            Добавить задачу
          </Button>
        </div>
      </div>

      {/* Search */}
      <TextInput
        placeholder="Поиск по задаче, исполнителю, проекту..."
        startIcon={<Icon icon={Search} />}
        value={search}
        onChange={(val) => setSearch(val ?? '')}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  Задача
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('owner')}
                >
                  Исполнитель
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('project')}
                >
                  Проект
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Статус
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('priority')}
                >
                  Приоритет
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('dueDate')}
                >
                  Срок
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  Задачи не найдены
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((task) => (
                <TableRow key={task.id} className={task.status === 'completed' ? 'opacity-60' : ''}>
                  <TableCell className="text-xs text-gray-400 font-mono">{task.id}</TableCell>
                  <TableCell className="font-medium max-w-[220px]">
                    <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
                      {task.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="text-xs">{task.ownerInitials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm whitespace-nowrap">{task.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{task.project}</span>
                  </TableCell>
                  <TableCell>
                    <Badge status={statusConfig[task.status].badge} size="sm">
                      {task.status === 'completed' && <Icon icon={Check} />}
                      {statusConfig[task.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[task.priority].cls}`}
                    >
                      {priorityConfig[task.priority].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">{task.dueDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton variant="ghost" size="sm" icon={MoreHorizontal} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Icon icon={Eye} />
                          Просмотр
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icon icon={Edit} />
                          Редактировать
                        </DropdownMenuItem>
                        {task.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => handleComplete(task.id)}>
                            <Icon icon={Check} />
                            Завершить
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Icon icon={Trash2} />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
