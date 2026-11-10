import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { navItems, profile } from './data'
import { useActiveSection } from './hooks/useActiveSection'
import './App.css'

const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))
const sectionIds = ['home', 'projects', 'about', 'skills', 'archive', 'github', 'journey', 'resume', 'contact']

class PortfolioErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-error" role="alert">
          <h1>Something went wrong.</h1>
          <p>Please refresh the page to try the portfolio again.</p>
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Refresh page <span aria-hidden="true">↻</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function PageLoader() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="page-loader"
      role="status"
      aria-label="Loading portfolio"
      initial={shouldReduceMotion ? false : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <img className="loader-avatar" src={profile.image} alt="" width="80" height="80" />
      <span className="loader-mark">{profile.name}</span>
      <span className="loader-line"><span /></span>
      <span className="loader-caption">Building something thoughtful</span>
    </motion.div>
  )
}

function ProfileBrand() {
  return (
    <Link className="profile-brand" to="/" aria-label={`${profile.name}, ${profile.role} — home`}>
      <img className="brand-avatar" src={profile.image} alt="" width="48" height="48" />
      <span className="brand-copy">
        <strong>{profile.name}</strong>
        <small>{profile.role}</small>
      </span>
    </Link>
  )
}

function Layout() {
  const location = useLocation()
  const progressRef = useRef(null)
  const scrolledRef = useRef(false)
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('portfolio-theme') !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const activeSection = useActiveSection(sectionIds)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    window.localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 700)
    let ticking = false

    const updateScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`
        const nextScrolled = window.scrollY > 24
        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled
          setScrolled(nextScrolled)
        }
        ticking = false
      })
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      window.clearTimeout(loadingTimer)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  useEffect(() => {
    const target = location.pathname.slice(1)
    let frame
    let attempts = 0

    const scrollToRoute = () => {
      if (!target) {
        window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
        return
      }

      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' })
      } else if (attempts < 120) {
        attempts += 1
        frame = window.requestAnimationFrame(scrollToRoute)
      }
    }

    frame = window.requestAnimationFrame(scrollToRoute)
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, shouldReduceMotion])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const handleNavigationClick = (id) => {
    closeMenu()
    if (location.pathname === (id ? `/${id}` : '/')) {
      document.getElementById(id || 'home')?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
        <ProfileBrand />

        <nav id="primary-navigation" className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <Link
              key={id || 'home'}
              className={(activeSection === (id || 'home') || (id === 'projects' && activeSection === 'archive')) ? 'is-active' : ''}
              to={id ? `/${id}` : '/'}
              onClick={() => handleNavigationClick(id)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">{darkMode ? '☼' : '☾'}</span>
          </button>
          <a className="header-resume" href={profile.resumeDownload} target="_blank" rel="noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <main>
        <PortfolioErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="*" element={<Portfolio />} />
            </Routes>
          </Suspense>
        </PortfolioErrorBoundary>
      </main>

      <footer className="footer">
        <div className="footer-branding">
          <ProfileBrand />
          <p>Thoughtful software, built one useful detail at a time.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {navItems.slice(1, 6).map(([id, label]) => (
            <Link key={id} to={`/${id}`} onClick={() => handleNavigationClick(id)}>{label}</Link>
          ))}
        </nav>
        <div className="footer-social">
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={`mailto:${profile.email}`}>Email ↗</a>
        </div>
        <span className="footer-note">© {new Date().getFullYear()} {profile.name}</span>
      </footer>

      <AnimatePresence>{isLoading && <PageLoader />}</AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}

export default App
