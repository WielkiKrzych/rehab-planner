'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 0, 0, 0.2)', border: '1px solid rgba(255, 0, 0, 0.3)' }}>
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Błąd komponentu</h3>
          <p className="text-white/50 text-sm mb-4">
            {this.state.error?.message || 'Wystąpił błąd podczas ładowania'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 btn-neon rounded-lg text-sm"
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
