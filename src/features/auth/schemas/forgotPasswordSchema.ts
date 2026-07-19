import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
