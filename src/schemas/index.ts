import * as zod from 'zod'

export const loginSchema = zod.object({
  email: zod
    .string({
      required_error: 'Email is reuired',
    })
    .min(1, 'Email is required')
    .email({ message: 'Enter a valid email address' }),
  password: zod
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password is required'),
})
