import { z } from 'zod'

export const teacherSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  qualification: z.string().min(1, 'Qualification is required'),
  designation: z.string().min(1, 'Designation is required'),
  joining_date: z.string().min(1, 'Joining date is required'),
  address: z.string().optional(),
})

export const addTeacherSchema = teacherSchema

export type TeacherFormValues = z.infer<typeof teacherSchema>
export type AddTeacherFormValues = TeacherFormValues
