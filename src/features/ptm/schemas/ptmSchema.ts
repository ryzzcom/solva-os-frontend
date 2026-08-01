import { z } from 'zod'

export const ptmSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['ENTIRE_CLASS', 'INDIVIDUAL_STUDENT']),
  class_id: z.string().optional(),
  section_id: z.string().optional(),
  section_ids: z.array(z.string()).optional(),
  student_ids: z.array(z.string()).optional(),
  date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
})

export type PtmFormValues = z.infer<typeof ptmSchema>
