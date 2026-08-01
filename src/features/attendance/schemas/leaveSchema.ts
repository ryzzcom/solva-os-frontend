import { z } from 'zod'

export const leaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional(),
})

export type LeaveStatusFormValues = z.infer<typeof leaveStatusSchema>
