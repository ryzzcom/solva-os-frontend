import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { StudentsDirectoryResponse, StudentsQueryParams, StudentItem } from '../types'

const LOCAL_STORAGE_STUDENTS_KEY = 'solva_os_local_students'

export const getStoredLocalStudents = (): StudentItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Failed to parse local students storage', err)
  }
  return []
}

export const saveLocalStudent = (newStudent: StudentItem) => {
  try {
    const current = getStoredLocalStudents()
    const updated = [newStudent, ...current]
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save student locally', err)
  }
}

export const fetchStudents = async (
  params: StudentsQueryParams
): Promise<StudentsDirectoryResponse> => {
  try {
    const { data } = await axiosInstance.get('/students', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || undefined,
        class_id: params.class_id || undefined,
        section_id: params.section_id || undefined,
        status: params.status || undefined,
      },
    })

    const resData = data?.data || data
    const apiStudents: StudentItem[] = resData?.students || (Array.isArray(resData) ? resData : [])

    // If backend DB returns active students list
    if (apiStudents.length > 0) {
      return {
        students: apiStudents,
        totalCount: resData?.totalCount || apiStudents.length,
        page: params.page || 1,
        limit: params.limit || 10,
      }
    }
  } catch (err) {
    console.warn('Backend /students endpoint fallback to local directory', err)
  }

  // Fallback to local storage persistent directory if DB is empty or unseeded
  const localList = getStoredLocalStudents()
  let filtered = [...localList]

  if (params.search) {
    const s = params.search.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        (item.full_name || item.name || '').toLowerCase().includes(s) ||
        (item.roll_no || item.rollNo || '').toLowerCase().includes(s)
    )
  }

  const start = ((params.page || 1) - 1) * (params.limit || 10)
  const paginated = filtered.slice(start, start + (params.limit || 10))

  return {
    students: paginated,
    totalCount: filtered.length,
    page: params.page || 1,
    limit: params.limit || 10,
  }
}

export const useStudents = (params: StudentsQueryParams) => {
  return useQuery<StudentsDirectoryResponse, Error>({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
    placeholderData: (previousData) => previousData,
  })
}
