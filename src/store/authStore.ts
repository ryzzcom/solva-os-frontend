import { create } from 'zustand'

export interface School {
  id: string
  schoolCode: string
  name: string
  email: string
  logo_url?: string | null
}

export interface User {
  id: string
  fullName: string
  email: string
  role: string
  schoolId: string
  profile_picture_url?: string | null
  school?: School | null
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string) => void
  updateUser: (user: Partial<User>) => void
  updateSchool: (school: Partial<School>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage if available
  let initialUser: User | null = null
  let initialToken: string | null = null

  try {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')
    const storedSchool = localStorage.getItem('school')

    if (storedUser) {
      initialUser = JSON.parse(storedUser)
      if (initialUser && storedSchool) {
        initialUser.school = JSON.parse(storedSchool)
      }
    }
    if (storedToken) {
      initialToken = storedToken
    }
  } catch (e) {
    console.error('Error parsing auth values from localStorage:', e)
  }

  return {
    user: initialUser,
    accessToken: initialToken,
    isAuthenticated: !!initialToken,

    setAuth: (user, accessToken) => {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('access_token', accessToken)
      if (user.school) {
        localStorage.setItem('school', JSON.stringify(user.school))
      }
      set({ user, accessToken, isAuthenticated: true })
    },

    updateUser: (updatedFields) =>
      set((state) => {
        if (!state.user) return {}
        const newUser = { ...state.user, ...updatedFields }
        localStorage.setItem('user', JSON.stringify(newUser))
        return { user: newUser }
      }),

    updateSchool: (updatedSchoolFields) =>
      set((state) => {
        if (!state.user) return {}
        const currentSchool = state.user.school || {
          id: state.user.schoolId,
          schoolCode: '',
          name: '',
          email: '',
        }
        const newSchool = { ...currentSchool, ...updatedSchoolFields }
        const newUser = { ...state.user, school: newSchool }
        localStorage.setItem('school', JSON.stringify(newSchool))
        localStorage.setItem('user', JSON.stringify(newUser))
        return { user: newUser }
      }),

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('school')
      set({ user: null, accessToken: null, isAuthenticated: false })
    },
  }
})
