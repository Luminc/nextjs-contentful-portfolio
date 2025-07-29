'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseAsyncDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncDataOptions {
  retryDelay?: number
  maxRetries?: number
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
      setRetryCount(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, retryDelay * Math.pow(2, retryCount)) // Exponential backoff
      } else {
        setState({ data: null, loading: false, error: errorMessage })
      }
    }
  }, [asyncFunction, retryCount, maxRetries, retryDelay])

  const retry = useCallback(() => {
    setRetryCount(0)
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [...dependencies, fetchData])

  return {
    ...state,
    retry,
    isRetrying: retryCount > 0,
  }
}