import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-xl mx-auto font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-extrabold text-white">Ripristino Dashboard</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Si è verificato un errore temporaneo nel caricamento della sessione locale. Clicca il pulsante in basso per ripristinare la dashboard.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              🔄 Ripristina Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
