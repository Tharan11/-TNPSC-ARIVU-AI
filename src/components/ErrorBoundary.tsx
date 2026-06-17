import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-error mb-4">Something went wrong</h1>
          <p className="text-text-secondary mb-6">
            ஏதோ தவறு நடந்தது. தயவுசெய்து பக்கத்தை மீண்டும் ஏற்றவும்.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
