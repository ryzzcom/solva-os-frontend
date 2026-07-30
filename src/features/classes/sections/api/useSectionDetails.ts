import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface SectionDetailsResponse {
  id: string
  name: string
  max_capacity: number
  class_id?: string
  class_name?: string
  class_teacher_id?: string | null
  class_teacher?: {
    id: string
    full_name: string
    profile_picture_url?: string | null
  } | null
  subjects?: string[]
}

export const useSectionDetails = (sectionId?: string) => {
  return useQuery<SectionDetailsResponse, Error>({
    queryKey: ['section-details', sectionId],
    queryFn: async () => {
      if (!sectionId) throw new Error('Section ID is required')
      const { data } = await axiosInstance.get(`/sections/${sectionId}/details`)
      const raw = data?.data || data

      const headerInfo = raw?.header_info || {}
      const assignedSubjects = raw?.assigned_subjects || headerInfo?.assigned_subjects || []
      const rawSubjects = raw?.subjects || headerInfo?.subjects || []

      // Extract subject names list accurately
      let extractedSubjects: string[] = []

      if (Array.isArray(assignedSubjects) && assignedSubjects.length > 0) {
        extractedSubjects = assignedSubjects
          .map((s: any) => (typeof s === 'string' ? s : s?.subject_name || s?.name || ''))
          .filter(Boolean)
      } else if (Array.isArray(rawSubjects) && rawSubjects.length > 0) {
        extractedSubjects = rawSubjects
          .map((s: any) => (typeof s === 'string' ? s : s?.name || s?.subject_name || ''))
          .filter(Boolean)
      }

      const teacherObj = headerInfo.class_teacher || raw?.class_teacher || null
      const teacherId =
        headerInfo.class_teacher_id ||
        headerInfo.class_teacher?.id ||
        raw?.class_teacher_id ||
        raw?.class_teacher?.id ||
        teacherObj?.id ||
        null

      const rawSectionName = headerInfo.section_name || raw?.section_name || raw?.name || ''
      const formattedSectionName = rawSectionName
        ? rawSectionName.startsWith('Section')
          ? rawSectionName
          : `Section ${rawSectionName}`
        : 'Section'

      return {
        id: raw?.id || raw?.section_id || sectionId,
        name: formattedSectionName,
        max_capacity: headerInfo.max_capacity || raw?.max_capacity || 30,
        class_id: headerInfo.class_id || raw?.class_id || raw?.class?.id || '',
        class_name: headerInfo.class_name || raw?.class_name || raw?.class?.name || 'Class',
        class_teacher_id: teacherId,
        class_teacher: teacherObj
          ? {
              id: teacherObj.id || teacherId || '',
              full_name: teacherObj.name || teacherObj.full_name || 'Teacher',
              profile_picture_url: teacherObj.pic || teacherObj.profile_picture_url || null,
            }
          : null,
        subjects: extractedSubjects,
      }
    },
    enabled: Boolean(sectionId),
    staleTime: 5 * 60 * 1000,
  })
}
