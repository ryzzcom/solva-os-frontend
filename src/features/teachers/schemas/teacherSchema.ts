import { z } from 'zod'

export const addTeacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  cnicNumber: z
    .string()
    .min(1, 'CNIC / National ID number is required.')
    .refine((val) => /^\d{5}-?\d{7}-?\d{1}$/.test(val), 'Invalid CNIC format (e.g. 42101-1234567-1)'),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
  salary: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
})

export type AddTeacherFormValues = z.infer<typeof addTeacherSchema>
