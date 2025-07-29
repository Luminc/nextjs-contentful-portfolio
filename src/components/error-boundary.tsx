'use client'

import React from 'react'
import { Container } from 'react-bootstrap'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} />
      }

      return <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  retry?: () => void
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => (
  <Container className="text-center py-5">
    <h2 className="h3 mb-3">Something went wrong</h2>
    <p className="text-muted mb-4">
      We encountered an error while loading this content. Please try refreshing the page.
    </p>
    {retry && (
      <button 
        onClick={retry} 
        className="btn btn-primary me-3"
      >
        Try Again
      </button>
    )}
    <button 
      onClick={() => window.location.reload()} 
      className="btn btn-outline-secondary"
    >
      Refresh Page
    </button>
    {error && process.env.NODE_ENV === 'development' && (
      <details className="mt-4 text-start">
        <summary className="text-muted small">Error Details (Development)</summary>
        <pre className="small mt-2 p-3 bg-light rounded">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    )}
  </Container>
)

export const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({ retry }) => (
  <Container className="text-center py-5">
    <h2 className="h3 mb-3">Connection Error</h2>
    <p className="text-muted mb-4">
      Unable to load content. Please check your internet connection and try again.
    </p>
    {retry && (
      <button 
        onClick={retry} 
        className="btn btn-primary"
      >
        Try Again
      </button>
    )}
  </Container>
)

export const NotFoundErrorFallback: React.FC = () => (
  <Container className="text-center py-5">
    <h2 className="h3 mb-3">Content Not Found</h2>
    <p className="text-muted mb-4">
      The content you're looking for doesn't exist or has been moved.
    </p>
    <a href="/" className="btn btn-primary">
      Go Home
    </a>
  </Container>
)