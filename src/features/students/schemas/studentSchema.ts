import { z } from 'zod'

export const addStudentSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required.'),
  grade: z.string().min(1, 'Please select a Class.'),
  section: z.string().min(1, 'Please select a Section.'),
  dob: z.string().min(1, 'Date of Birth is required.'),
  gender: z.enum(['Male', 'Female', 'Other']),
  fatherName: z.string().min(1, 'Father / Parent Name is required.'),
  fatherPhone: z.string().min(1, 'Father / Parent Phone is required.'),
  bloodGroup: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
})

export type AddStudentFormValues = z.infer<typeof addStudentSchema>

export const updateStudentSchema = z.object({
  full_name: z.string().min(1, 'Full Name is required.'),
  class_id: z.string().optional(),
  section_id: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  father_name: z.string().optional(),
  father_phone: z.string().optional(),
  blood_group: z.string().optional(),
  city: z.string().optional(),
})

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>
