import { z } from 'zod'

export const holidaySchema = z
  .object({
    name: z.string().min(2, 'Holiday name must be at least 2 characters'),
    type: z.enum(['Seasonal', 'Religious', 'National']),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    is_recurring: z.boolean(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end >= start
    },
    {
      message: 'End date must be greater than or equal to start date',
      path: ['end_date'],
    }
  )

export type HolidayFormValues = z.infer<typeof holidaySchema>
