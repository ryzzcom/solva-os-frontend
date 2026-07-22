import { z } from 'zod'

export const addStudentSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required.'),
  rollNo: z.string().min(1, 'Roll No is required.'),
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
