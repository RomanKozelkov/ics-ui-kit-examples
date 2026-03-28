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
  FormBody,
  FormFooter,
  FormHeader,
  FormTitle,
  FormDescription,
  FormStack,
} from 'ics-ui-kit/components/form'
import { TextInput } from 'ics-ui-kit/components/input'
import { SecretInput } from 'ics-ui-kit/components/input'
import { Button } from 'ics-ui-kit/components/button'
import { Icon } from 'ics-ui-kit/components/icon'
import { Mail, LogIn } from 'lucide-react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginFormPage() {
  const [submitted, setSubmitted] = useState<LoginFormValues | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: LoginFormValues) {
    setSubmitted(values)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormHeader>
              <FormTitle>Вход в систему</FormTitle>
              <FormDescription>
                Введите свои учётные данные для доступа к системе
              </FormDescription>
            </FormHeader>
            <FormBody>
              <FormStack>
                <FormFieldControl
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <TextInput
                          placeholder="name@company.ru"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <SecretInput
                          placeholder="Введите пароль"
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
            </FormBody>
            <FormFooter>
              <Button type="submit" className="w-full">
                <Icon icon={LogIn} />
                Войти
              </Button>
            </FormFooter>
          </form>
        </Form>

        {submitted && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-800">Успешный вход!</p>
            <p className="text-sm text-green-700 mt-1">Email: {submitted.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
