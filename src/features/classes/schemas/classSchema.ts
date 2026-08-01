import { z } from 'zod'

export const sectionInputSchema = z.object({
  section_name: z.string().min(1, 'Section name is required'),
  class_teacher_id: z.string().nullable().optional(),
  max_capacity: z.number().min(1, 'Capacity must be at least 1').default(30),
})

export const createClassSchema = z.object({
  class_name: z.string().min(1, 'Class name is required'),
  sections: z.array(sectionInputSchema).min(1, 'At least one section must be defined'),
  subjects: z.array(z.string()).optional().default([]),
})

export type CreateClassSchemaType = z.infer<typeof createClassSchema>
