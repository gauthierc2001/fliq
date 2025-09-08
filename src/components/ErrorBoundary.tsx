'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-md mx-auto text-center p-8">
              <div className="card p-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Something went wrong
                </h2>
                <p className="text-slate-600 mb-6">
                  We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Refresh Page
                </button>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-slate-500">
                      Error Details (Dev Mode)
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
