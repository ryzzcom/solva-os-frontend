import { z } from 'zod'

export const createAnnouncementSchema = z
  .object({
    title: z.string().min(3, 'Notice title must be at least 3 characters.'),
    description: z.string().min(5, 'Description must be at least 5 characters.'),
    audience: z.enum(['ALL', 'STUDENT', 'TEACHER'], {
      message: 'Please select an audience.',
    }),
    date: z.string().min(1, 'Please select a date.'),
    target_class_id: z.string().optional().nullable(),
    target_section_id: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.target_section_id && data.target_section_id !== 'ALL' && (!data.target_class_id || data.target_class_id === 'ALL')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a Target Class when specifying a Section.',
        path: ['target_class_id'],
      })
    }
  })

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>
