import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '../data'

export const MagneticButton = memo(function MagneticButton({ to, href, className = '', children, target, rel }) {
  const shouldReduceMotion = useReducedMotion()
  const resetOffset = (event) => {
    event.currentTarget.style.setProperty('--mag-x', '0px')
    event.currentTarget.style.setProperty('--mag-y', '0px')
  }
  const updateOffset = (event) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * 0.12))
    const y = Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * 0.12))
    event.currentTarget.style.setProperty('--mag-x', `${x}px`)
    event.currentTarget.style.setProperty('--mag-y', `${y}px`)
  }
  const linkProps = {
    className: `${className} magnetic-button`,
    onPointerMove: updateOffset,
    onPointerLeave: resetOffset,
    children,
  }

  return to
    ? <Link {...linkProps} to={to} />
    : <a {...linkProps} href={href} target={target} rel={rel} />
})

export const Reveal = memo(function Reveal({ children, className = '', delay = 0, as = 'div', ...props }) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      {...props}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.65, delay, ease: [0.2, 0.75, 0.25, 1] }}
    >
      {children}
    </MotionTag>
  )
})

export const SectionHeading = memo(function SectionHeading({ number, title, description, eyebrow = 'Selected perspective' }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow"><span>{number}</span>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
})

export function AnimatedCursor() {
  const shouldReduceMotion = useReducedMotion()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 260, damping: 24, mass: 0.3 })
  const springY = useSpring(cursorY, { stiffness: 260, damping: 24, mass: 0.3 })

  useEffect(() => {
    if (shouldReduceMotion || !window.matchMedia('(pointer: fine)').matches) return undefined

    const handlePointerMove = (event) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [cursorX, cursorY, shouldReduceMotion])

  if (shouldReduceMotion || !window.matchMedia('(pointer: fine)').matches) return null

  return (
    <motion.span className="animated-cursor" style={{ x: springX, y: springY }} aria-hidden="true">
      <i />
    </motion.span>
  )
}

export const ProfileImage = memo(function ProfileImage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="profile-image-frame"
      animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="portrait-glow" aria-hidden="true" />
      <img src={profile.image} alt={`${profile.name} professional portrait`} width="440" height="520" fetchPriority="high" />
      <span className="portrait-label">S.K. / Developer</span>
    </motion.div>
  )
})

export const ProfileAvatar = memo(function ProfileAvatar({ className = '', alt = '' }) {
  return <img className={`profile-avatar ${className}`} src={profile.image} alt={alt} width="160" height="160" loading="lazy" />
})

export const SkillGroupCard = memo(function SkillGroupCard({ number, title, skills, delay = 0 }) {
  return (
    <Reveal className="skill-card" delay={delay}>
      <div className="skill-card-heading">
        <span className="card-number">{number}</span>
        <span className="skill-orbit" aria-hidden="true"><span /></span>
      </div>
      <h3>{title}</h3>
      <div className="skill-card-content">
        {skills.map((skill) => <span key={skill} className="skill-badge">{skill}</span>)}
      </div>
    </Reveal>
  )
})

export const JourneyTimeline = memo(function JourneyTimeline({ milestones }) {
  return (
    <div className="journey-timeline">
      {milestones.map((milestone, index) => (
        <Reveal key={milestone.title} className={`timeline-item${index === milestones.length - 1 ? ' is-current' : ''}`} delay={index * 0.04}>
          <div className="timeline-marker" aria-hidden="true"><span /></div>
          <div className="timeline-content">
            <span>{milestone.year}</span>
            <h3>{milestone.title}</h3>
            <p>{milestone.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
})

function ProjectArt({ project }) {
  return (
    <div className={`project-visual project-visual--${project.visual}`} aria-hidden="true">
      <div className="project-visual-top">
        <span /><span /><span />
        <small>{project.technologies.slice(0, 2).join(' / ')}</small>
      </div>
      <div className="project-visual-content">
        <span className="visual-index">{project.number}</span>
        <div className="visual-mark">{project.visual === 'bookstore' ? 'B.' : project.visual === 'security' ? '◎' : project.visual === 'contacts' ? '↗' : 'S.'}</div>
        <div className="visual-lines"><span /><span /><span /></div>
        <div className="visual-chip">{project.category}</div>
      </div>
    </div>
  )
}

export const ProjectCard = memo(function ProjectCard({ project, onSelect }) {
  return (
    <Reveal className="project-card" onPointerMove={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
      event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
    }}>
      <ProjectArt project={project} />
      <div className="project-content">
        <div className="project-meta">
          <span>{project.number} / {project.category} <i className="project-status">{project.status}</i></span>
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <div className="project-actions">
          <button type="button" className="text-link" onClick={() => onSelect(project)}>
            Explore case study <span aria-hidden="true">↗</span>
          </button>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-link text-link-muted">
              Live Demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
})

export const ArchiveProjectCard = memo(function ArchiveProjectCard({ project }) {
  return (
    <article className="archive-card">
      <div className={`archive-art archive-art--${project.visual}`} aria-hidden="true">
        <span>{project.number}</span>
        <i />
      </div>
      <div className="archive-card-copy">
        <span className="archive-number">PROJECT / {project.number}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <div className="archive-card-actions">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-link">Live Demo <span aria-hidden="true">↗</span></a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-link text-link-muted">GitHub <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  )
})

export const GitHubRepoCard = memo(function GitHubRepoCard({ repository }) {
  return (
    <a className="repo-tile" href={repository.html_url} target="_blank" rel="noreferrer">
      <div className="repo-tile-heading">
        <span className="repo-icon" aria-hidden="true">⌘</span>
        <span className="repo-arrow" aria-hidden="true">↗</span>
      </div>
      <strong>{repository.name}</strong>
      <p>{repository.description || 'A public project from my GitHub profile.'}</p>
      <span className="repo-language">
        {repository.language && <i aria-hidden="true" />}
        {repository.language || 'Source code'}
        <span>★ {repository.stargazers_count}</span>
      </span>
    </a>
  )
})

export function ProjectDetailsModal({ project, onClose }) {
  const closeButtonRef = useRef(null)
  const returnFocusRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const screenshots = project?.screenshots || []

  useEffect(() => {
    if (!project) return undefined

    const previousOverflow = document.body.style.overflow
    returnFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusableElements = [...document.querySelectorAll(
          '.project-modal a[href], .project-modal button:not([disabled]), .project-modal iframe, .project-modal [tabindex]:not([tabindex="-1"])',
        )]
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusRef.current?.focus?.()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <button ref={closeButtonRef} type="button" className="modal-close" onClick={onClose} aria-label="Close project details">×</button>
            <div className="project-modal-header">
              <p className="eyebrow"><span>{project.number}</span>{project.category} · {project.status}</p>
              <h2 id="project-modal-title">{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <div className="project-modal-grid">
              {[
                  ['Overview', project.description],
                  ['Problem statement', project.problemStatement],
                  ['Architecture', project.architecture],
                  ['Features', project.highlights],
                  ['Solution', project.solution],
                  ['Challenges', project.challenges],
                  ['Learning outcomes', project.learningOutcomes],
                ].map(([heading, copy]) => (
                  <section key={heading}>
                    <h3>{heading}</h3>
                    {Array.isArray(copy)
                      ? <ul>{copy.map((item) => <li key={item}>{item}</li>)}</ul>
                      : <p>{copy}</p>}
                  </section>
                ))}
            </div>
            <div className="project-modal-bottom">
              <div>
                <h3>Technology</h3>
                <div className="tag-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
              </div>
              <div className="project-screenshots">
                <h3>Screenshots</h3>
                {screenshots.length > 0 ? (
                  <div className="project-screenshot-grid">
                    {screenshots.map((screenshot) => (
                      <figure key={screenshot.src}>
                        <img src={screenshot.src} alt={screenshot.alt} loading="lazy" />
                        {screenshot.caption && <figcaption>{screenshot.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                ) : <p className="screenshot-placeholder">Project screenshots will be added as visual captures become available.</p>}
              </div>
            </div>
            <div className="project-modal-actions">
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button button-primary">GitHub <span aria-hidden="true">↗</span></a>}
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button button-secondary">Live Demo <span aria-hidden="true">↗</span></a>}
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ResumeViewer() {
  return (
    <details className="resume-details">
      <summary>Preview the resume <span aria-hidden="true">↗</span></summary>
      <div className="resume-embed">
        <iframe title="Siva Kumar Eekalpa resume" src={profile.resumePreview} loading="lazy" />
        <a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">Open in Google Drive ↗</a>
      </div>
    </details>
  )
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [errors, setErrors] = useState({})
  const timerRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validation = {}
    if (!form.name.trim()) validation.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) validation.email = 'Please enter a valid email address.'
    if (!form.subject.trim()) validation.subject = 'Please add a subject.'
    if (!form.message.trim()) validation.message = 'Please include a short message.'
    setErrors(validation)
    if (Object.keys(validation).length) return

    setPreparing(true)
    const subject = encodeURIComponent(form.subject.trim())
    const body = encodeURIComponent(`Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`)
    timerRef.current = window.setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setPreparing(false)
      setSubmitted(true)
    }, 350)
  }

  if (submitted) {
    return (
      <div className="success-panel" aria-live="polite">
        <span className="success-mark" aria-hidden="true">✓</span>
        <h3>Your email draft is ready.</h3>
        <p>It has been prepared in your email app—please review and send it to complete your message.</p>
        <a href={`mailto:${profile.email}`} className="text-link">Email me directly ↗</a>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <span>Send a note</span>
        <p>Share a role, collaboration, or a good question.</p>
      </div>
      <div className="form-row">
        <label>
          Name
          <input name="name" autoComplete="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
          {errors.name && <small id="contact-name-error">{errors.name}</small>}
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
          {errors.email && <small id="contact-email-error">{errors.email}</small>}
        </label>
      </div>
      <label>
        Subject
        <input name="subject" value={form.subject} onChange={updateField} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'contact-subject-error' : undefined} />
        {errors.subject && <small id="contact-subject-error">{errors.subject}</small>}
      </label>
      <label>
        Message
        <textarea name="message" rows="5" value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
        {errors.message && <small id="contact-message-error">{errors.message}</small>}
      </label>
      <div className="form-submit-row">
        <span>Your mail app will open with a draft.</span>
        <button type="submit" className="button button-primary" disabled={preparing}>
          {preparing ? 'Preparing…' : 'Prepare email'}
          <span aria-hidden="true">{preparing ? '···' : '↗'}</span>
        </button>
      </div>
    </form>
  )
}
