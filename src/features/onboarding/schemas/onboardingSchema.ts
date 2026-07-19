import { z } from 'zod'

export const onboardingStep1Schema = z.object({
  school_logo: z.any().optional(),
  school_name: z.string().min(1, { message: 'School name is required' }),
  campus_name: z.string().min(1, { message: 'Campus name is required' }),
  principal_name: z.string().min(1, { message: 'Principal full name is required' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  school_timings: z.string().min(1, { message: 'School timings are required' }),
  academic_year: z.string().min(1, { message: 'Academic year is required' }),
})

export const onboardingStep2Schema = z.object({
  cnic_number: z
    .string()
    .min(1, { message: 'CNIC number is required' })
    .regex(/^\d{13}$/, { message: 'CNIC must be exactly 13 digits without hyphens' }),
  electricity_bill: z
    .any()
    .refine((file) => file instanceof File, { message: 'Electricity bill document is required' }),
  certificate_of_registration: z
    .any()
    .refine((file) => file instanceof File, { message: 'Certificate of registration is required' }),
})

export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>
