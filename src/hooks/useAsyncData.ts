'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * ADVANCED ASYNC DATA MANAGEMENT HOOK
 * 
 * This custom hook provides sophisticated data fetching with:
 * - Automatic retry logic with exponential backoff
 * - Loading and error state management
 * - Dependency-based re-fetching
 * - TypeScript generics for type safety
 * 
 * Usage:
 * const { data, loading, error, retry } = useAsyncData(
 *   () => fetchProjects(),
 *   [projectFilter], // dependencies - refetch when these change
 *   { maxRetries: 3, retryDelay: 1000 }
 * )
 */

interface UseAsyncDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncDataOptions {
  retryDelay?: number // Base delay between retries (default: 1000ms)
  maxRetries?: number // Maximum retry attempts (default: 3)
}

export const useAsyncData = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncDataOptions = {}
) => {
  const [state, setState] = useState<UseAsyncDataState<T>>({
    data: null,
    loading: true,
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)

  const { retryDelay = 1000, maxRetries = 3 } = options

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
      setRetryCount(0) // Reset retry count on successful fetch
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      
      // Implement retry logic with exponential backoff
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, retryDelay * Math.pow(2, retryCount)) // Exponential backoff: 1s, 2s, 4s, 8s...
      } else {
        // Max retries reached - set error state
        setState({ data: null, loading: false, error: errorMessage })
      }
    }
  }, [asyncFunction, retryCount, maxRetries, retryDelay])

  // Manual retry function - resets retry count and starts fresh
  const retry = useCallback(() => {
    setRetryCount(0)
    fetchData()
  }, [fetchData])

  // Re-fetch data when dependencies change
  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, fetchData])

  return {
    ...state,
    retry, // Manual retry function
    isRetrying: retryCount > 0, // Indicates if currently in retry mode
  }
}