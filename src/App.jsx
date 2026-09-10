import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { navItems, profile } from './data'
import './App.css'

const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))

class PortfolioErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div className="page-error" role="alert"><h1>Something went wrong.</h1><p>Please refresh the page to try the portfolio again.</p><button className="button button-primary" onClick={() => window.location.reload()}>Refresh page <span>↻</span></button></div>
    }
    return this.props.children
  }
}

function Layout() {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('portfolio-theme') !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'; window.localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light') }, [darkMode])
  useEffect(() => { const target = location.pathname.slice(1); if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])

  return <div className="site-shell"><header className="topbar"><Link className="wordmark" to="/" aria-label="Siva Kumar home">SK<span>.</span></Link><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}><span /> <span /></button><nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">{navItems.map(([id, label]) => <Link key={id} to={id ? `/${id}` : '/'} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav><button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}><span>{darkMode ? '☼' : '◐'}</span> {darkMode ? 'Light' : 'Dark'}</button></header><main><PortfolioErrorBoundary><Suspense fallback={<div className="page-loading" role="status">Loading portfolio...</div>}><Routes><Route path="*" element={<Portfolio />} /></Routes></Suspense></PortfolioErrorBoundary></main><footer className="footer"><div><span>© 2025 Siva Kumar Eekalpa</span><span>Built with React + Vite</span></div><nav aria-label="Footer navigation">{navItems.slice(0, 3).map(([id, label]) => <Link key={id} to={id ? `/${id}` : '/'}>{label}</Link>)}</nav><div className="footer-social"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a><a href={`mailto:${profile.email}`} aria-label="Email">@</a></div></footer></div>
}

function App() { return <HashRouter><Layout /></HashRouter> }

export default App
