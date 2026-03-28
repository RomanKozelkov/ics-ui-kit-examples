import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormFieldControl,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  FormBody,
  FormFooter,
  FormHeader,
  FormTitle,
  FormStack,
  FormSectionTitle,
  FormDivider,
} from 'ics-ui-kit/components/form'
import { TextInput } from 'ics-ui-kit/components/input'
import { SecretInput } from 'ics-ui-kit/components/input'
import { Button } from 'ics-ui-kit/components/button'
import { Icon } from 'ics-ui-kit/components/icon'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'ics-ui-kit/components/select'
import { Checkbox } from 'ics-ui-kit/components/checkbox'
import { User, Mail, Briefcase, UserPlus, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const registrationSchema = z.object({
  firstName: z.string().min(2, { message: 'Минимум 2 символа' }),
  lastName: z.string().min(2, { message: 'Минимум 2 символа' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  role: z.string().min(1, { message: 'Выберите роль' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v === true, {
    message: 'Необходимо принять условия',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

const roles = [
  { value: 'developer', label: 'Разработчик' },
  { value: 'designer', label: 'Дизайнер' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'analyst', label: 'Аналитик' },
  { value: 'devops', label: 'DevOps-инженер' },
]

export default function RegistrationFormPage() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  function onSubmit(_values: RegistrationFormValues) {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md text-center p-8 rounded-2xl border border-green-200 bg-green-50">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-green-900">Регистрация завершена!</h2>
          <p className="text-green-700 mt-2">
            Добро пожаловать, {form.getValues('firstName')} {form.getValues('lastName')}!
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              form.reset()
            }}
          >
            Зарегистрировать ещё
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-8">
      <div className="w-full max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormHeader>
              <FormTitle>Регистрация</FormTitle>
              <FormDescription>
                Создайте аккаунт для доступа к системе
              </FormDescription>
            </FormHeader>

            <FormBody>
              <FormSectionTitle>Личные данные</FormSectionTitle>
              <FormStack>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldControl
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <TextInput
                            placeholder="Иван"
                            startIcon={<Icon icon={User} />}
                            value={field.value}
                            onChange={(val) => field.onChange(val ?? '')}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormFieldControl
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <TextInput
                            placeholder="Иванов"
                            value={field.value}
                            onChange={(val) => field.onChange(val ?? '')}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormFieldControl
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <TextInput
                          placeholder="ivan@company.ru"
                          type="email"
                          startIcon={<Icon icon={Mail} />}
                          value={field.value}
                          onChange={(val) => field.onChange(val ?? '')}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormFieldControl
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Роль</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              <SelectValue placeholder="Выберите роль" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormStack>

              <FormDivider />

              <FormSectionTitle>Безопасность</FormSectionTitle>
              <FormStack>
                <FormFieldControl
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <SecretInput
                          placeholder="Минимум 8 символов"
                          value={field.value}
                          onChange={(val) => field.onChange(val ?? '')}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>
                        Используйте буквы, цифры и специальные символы
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormFieldControl
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтверждение пароля</FormLabel>
                      <FormControl>
                        <SecretInput
                          placeholder="Повторите пароль"
                          value={field.value}
                          onChange={(val) => field.onChange(val ?? '')}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormStack>

              <FormDivider />

              <FormFieldControl
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <div>
                        <FormLabel htmlFor="terms" className="cursor-pointer">
                          Я принимаю условия использования и политику конфиденциальности
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </FormBody>

            <FormFooter>
              <div className="flex gap-3 w-full">
                <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()}>
                  Сбросить
                </Button>
                <Button type="submit" className="flex-1">
                  <Icon icon={UserPlus} />
                  Зарегистрироваться
                </Button>
              </div>
            </FormFooter>
          </form>
        </Form>
      </div>
    </div>
  )
}
