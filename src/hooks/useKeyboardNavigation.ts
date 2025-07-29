'use client'

import { useEffect, useCallback } from 'react'

interface UseKeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableEnterSelection?: boolean
  containerSelector?: string
  itemSelector?: string
}

export const useKeyboardNavigation = (
  options: UseKeyboardNavigationOptions = {}
) => {
  const {
    enableArrowKeys = true,
    enableEnterSelection = true,
    containerSelector = '.card-columns',
    itemSelector = '.card a'
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enableArrowKeys && !enableEnterSelection) return

    const container = document.querySelector(containerSelector)
    if (!container) return

    const focusableItems = Array.from(
      container.querySelectorAll(itemSelector)
    ) as HTMLElement[]

    if (focusableItems.length === 0) return

    const currentIndex = focusableItems.findIndex(item => 
      item === document.activeElement
    )

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (enableArrowKeys) {
          event.preventDefault()
          const nextIndex = (currentIndex + 1) % focusableItems.length
          focusableItems[nextIndex]?.focus()
        }
        break

      case 'ArrowUp':
      case 'ArrowLeft':
        if (enableArrowKeys) {
          event.preventDefault()
          const prevIndex = currentIndex <= 0 
            ? focusableItems.length - 1 
            : currentIndex - 1
          focusableItems[prevIndex]?.focus()
        }
        break

      case 'Home':
        if (enableArrowKeys) {
          event.preventDefault()
          focusableItems[0]?.focus()
        }
        break

      case 'End':
        if (enableArrowKeys) {
          event.preventDefault()
          focusableItems[focusableItems.length - 1]?.focus()
        }
        break

      case 'Enter':
      case ' ':
        if (enableEnterSelection && document.activeElement) {
          const activeElement = document.activeElement as HTMLElement
          if (focusableItems.includes(activeElement)) {
            event.preventDefault()
            activeElement.click()
          }
        }
        break
    }
  }, [enableArrowKeys, enableEnterSelection, containerSelector, itemSelector])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    // Helper function to focus first item
    focusFirst: () => {
      const container = document.querySelector(containerSelector)
      const firstItem = container?.querySelector(itemSelector) as HTMLElement
      firstItem?.focus()
    },
    
    // Helper function to announce to screen readers
    announce: (message: string) => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }
}