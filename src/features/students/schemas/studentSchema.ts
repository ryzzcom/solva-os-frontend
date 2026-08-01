import { z } from 'zod'

export const studentSchema = z.object({
  registration_no: z.string().min(1, 'Registration number is required'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  class_id: z.string().min(1, 'Class selection is required'),
  section_id: z.string().min(1, 'Section selection is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  guardian_name: z.string().min(2, 'Guardian name is required'),
  guardian_phone: z.string().min(10, 'Valid contact number is required'),
  address: z.string().optional(),
})

export const addStudentSchema = studentSchema

export type StudentFormValues = z.infer<typeof studentSchema>
export type AddStudentFormValues = StudentFormValues
