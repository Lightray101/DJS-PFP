import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            margin: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "#dc3545",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              color: "#dc3545",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          >
            Oops! Something went wrong
          </h2>
          <p
            style={{
              color: "#666",
              marginBottom: "1.5rem",
              lineHeight: "1.5",
            }}
          >
            We're sorry, but something unexpected happened. Please try
            refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          >
            Refresh Page
          </button>
          <button
            onClick={() =>
              this.setState({ hasError: false, error: null, errorInfo: null })
            }
            style={{
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#545b62")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#6c757d")}
          >
            Try Again
          </button>

          {/* Show error details in development */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details
              style={{
                marginTop: "2rem",
                textAlign: "left",
                background: "#f8f9fa",
                padding: "1rem",
                borderRadius: "4px",
                border: "1px solid #dee2e6",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  fontSize: "12px",
                  color: "#dc3545",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
