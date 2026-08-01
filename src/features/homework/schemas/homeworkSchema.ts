import { z } from 'zod'

export const homeworkSchema = z.object({
  title: z.string().min(3, 'Homework title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  subject: z.string().min(1, 'Subject selection is required'),
  class_id: z.string().min(1, 'Class selection is required'),
  section_id: z.string().min(1, 'Section selection is required'),
  due_date: z.string().min(1, 'Due date is required'),
})

export type HomeworkFormValues = z.infer<typeof homeworkSchema>
