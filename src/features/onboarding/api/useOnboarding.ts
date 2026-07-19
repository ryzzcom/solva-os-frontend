import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface OnboardingPayload {
  school_name: string
  campus_name: string
  principal_name: string
  phone_number: string
  address: string
  school_timings: string
  academic_year: string
  cnic_number: string
  school_logo?: File | null
  electricity_bill: File
  certificate_of_registration: File
}

interface OnboardingResponse {
  status: string
  message: string
  data?: any
}

export const useOnboarding = () => {
  return useMutation<OnboardingResponse, Error, OnboardingPayload>({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append('school_name', data.school_name)
      formData.append('campus_name', data.campus_name)
      formData.append('principal_name', data.principal_name)
      formData.append('phone_number', data.phone_number)
      formData.append('address', data.address)
      formData.append('school_timings', data.school_timings)
      formData.append('academic_year', data.academic_year)
      formData.append('cnic_number', data.cnic_number)

      if (data.school_logo) {
        formData.append('school_logo', data.school_logo)
      }
      formData.append('electricity_bill', data.electricity_bill)
      formData.append('certificate_of_registration', data.certificate_of_registration)

      const response = await axiosInstance.post<OnboardingResponse>('/schools/setup/school-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
  })
}
