import { z } from 'zod'

export const createSectionSchema = z.object({
  section_name: z.string().min(1, 'Section name is required'),
  class_teacher_id: z.string().nullable().optional(),
  max_capacity: z.number().min(1, 'Capacity must be at least 1').default(30),
  subjects: z.array(z.string()).optional().default([]),
})

export type CreateSectionSchemaType = z.infer<typeof createSectionSchema>
