import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    },
  },
})

export const clearAppCache = () => {
  try {
    queryClient.cancelQueries()
    queryClient.clear()
  } catch (error) {
    console.error('Error clearing query cache:', error)
  }
}
