// src/components/ErrorBoundary.js

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-red-500">
            Something went wrong.
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
