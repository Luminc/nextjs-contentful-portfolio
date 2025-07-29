'use client'

import { getPages } from '@/lib/api'
import { useAsyncData } from './useAsyncData'

/**
 * Custom hook for fetching and caching pages data
 * Prevents duplicate API calls across components
 */
export const usePages = () => {
  return useAsyncData(getPages, [], { maxRetries: 2, retryDelay: 1000 })
}