import { z } from 'zod'

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Verification code must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'Verification code must contain only numbers' }),
})

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
