import { useState } from 'react'
import { profile } from '../data'

export function SectionHeading({ number, title }) {
  return <div className="section-heading"><span>{number} /</span><h2>{title}</h2></div>
}

export function ProfileImage() {
  return <div className="profile-image-frame"><img src={profile.image} alt={`${profile.name} professional portrait`} loading="eager" width="180" height="180" /><span>SK / 2025</span></div>
}

export function SkillBadge({ skill, category }) {
  return <li className="skill-badge" title={`${skill} · ${category}`}><span aria-hidden="true">+</span>{skill}</li>
}

export function ProjectCard({ project, live = false }) {
  const { title, type, number, visual, description, tags, link, html_url, stargazers_count, forks_count, language } = project
  const projectLink = link || html_url
  return <article className={`project-card ${live ? 'live-project' : ''}`}>
    {!live ? <ProjectVisual type={visual} title={title} /> : <div className="repo-icon" aria-hidden="true">{(language || 'G').slice(0, 1)}</div>}
    <div className="project-info"><div className="project-meta"><span>{number ? `${number} / ${type}` : 'GitHub repository'}</span>{projectLink && <a href={projectLink} target="_blank" rel="noreferrer">{live ? 'Open repo' : 'GitHub'} ↗</a>}</div><h3>{title}</h3><p>{description || 'A repository from Siva Kumar Eekalpa on GitHub.'}</p>{live && <div className="repo-stats"><span>★ {stargazers_count || 0} stars</span><span>⑂ {forks_count || 0} forks</span></div>}<div className="tag-list">{(tags || [language]).filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
  </article>
}

function ProjectVisual({ type, title }) {
  return <div className={`project-visual ${type}`} aria-label={`${title} project preview`}><div className="browser-bar"><i /><i /><i /><span>{type === 'chat' ? 'localhost:8080/chat' : 'bookstore.app/catalog'}</span></div>{type === 'chat' ? <div className="chat-preview"><span className="bot-bubble">How can I help you today?</span><span className="user-bubble">Explain microservices simply.</span><span className="bot-bubble short">A system of small, focused services.</span></div> : <div className="book-preview"><div className="book-cover">THE<br /><b>MAKING</b><br />OF IDEAS</div><div><small>Featured collection</small><strong>Build better.<br />Ship often.</strong><span>Explore books →</span></div></div>}</div>
}

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('email')}`)}`
    setSent(true)
  }
  return <form className="contact-form" onSubmit={handleSubmit}><label>Email<input name="email" type="email" placeholder="you@company.com" required /></label><label>Subject<input name="subject" placeholder="Let's build something" required /></label><label>Message<textarea name="message" rows="4" placeholder="Tell me a little about the opportunity..." required /></label><button className="button button-primary" type="submit">Send message <span>↗</span></button>{sent && <p className="form-note">Your email client should open shortly.</p>}</form>
}

export function ResumeViewer() {
  return <details className="resume-details"><summary>View ATS-friendly resume</summary><div className="resume-embed"><iframe title="Siva Kumar Eekalpa resume" src={profile.resumePreview} loading="lazy" /> <div className="resume-actions"><a className="button button-light" href={profile.resumeDownload} target="_blank" rel="noreferrer">Download PDF <span>↓</span></a><a className="resume-open" href={profile.resume} target="_blank" rel="noreferrer">Open in Google Drive ↗</a></div><article className="resume-text"><strong>SIVA KUMAR EEKALPA</strong><p>Java Developer · Hyderabad, Telangana · {profile.email} · {profile.phone}</p><p><b>SUMMARY</b><br />{profile.summary}</p><p><b>EDUCATION</b><br />B.Tech in Computer Science and Engineering, JNTUH · 2021 - 2025 · CGPA 7.12/10</p><p><b>PROJECTS</b><br />AI Chatbot Application: Spring Boot, Spring AI, JWT, MySQL, Ollama.<br />BookStore Microservices Platform: Spring Boot, Spring Cloud, React.js, API Gateway, OpenFeign.</p></article></div></details>
}