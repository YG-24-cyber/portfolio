import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Runtime Exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-slate-900/80 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl border border-red-500/30">
              !
            </div>
            <h2 className="text-xl font-bold mb-2">Temporary View Exception</h2>
            <p className="text-slate-400 text-sm mb-6">
              An unexpected render error occurred in this view. The application core remains stable.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/20"
              >
                Reload Interface
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition border border-white/10"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
