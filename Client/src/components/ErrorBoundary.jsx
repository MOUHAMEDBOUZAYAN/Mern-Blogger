import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
          <p className="text-lg mb-4">We're sorry for the inconvenience. Please try again later.</p>
          {/* Optional: Display error details in development */}
          {this.state.error && (
            <details className="bg-red-200 p-3 rounded-md mt-4 text-sm max-w-lg overflow-auto">
              <summary>Error Details</summary>
              <pre className="whitespace-pre-wrap">{
                this.state.error.toString()
              }</pre>
              <pre className="whitespace-pre-wrap">{
                this.state.errorInfo.componentStack
              }</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
