import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  education,
  heroTechnologies,
  journeyMilestones,
  profile,
  skillGroups,
} from '../data'
import { archiveProjects, featuredProjects } from '../data/projects'
import { useGithubRepositories } from '../hooks/useGithubRepositories'
import {
  ArchiveProjectCard,
  AnimatedCursor,
  ContactForm,
  GitHubRepoCard,
  JourneyTimeline,
  MagneticButton,
  ProfileImage,
  ProjectCard,
  ProjectDetailsModal,
  ProfileAvatar,
  ResumeViewer,
  Reveal,
  SectionHeading,
  SkillGroupCard,
} from '../components/PortfolioComponents'

function HeroRole() {
  const roles = [profile.role, ...profile.secondaryRoles]
  const [roleIndex, setRoleIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return undefined
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [roles.length, shouldReduceMotion])

  return (
    <span className="hero-role">
      {shouldReduceMotion ? profile.role : (
        <AnimatePresence mode="wait">
          <motion.span
            key={roles[roleIndex]}
            className="hero-role-value"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
          >
            {roles[roleIndex]}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  )
}

function formatUpdatedDate(dateString) {
  if (!dateString) return 'Recently'
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(dateString))
}

export default function Portfolio() {
  const { repositories, repositoryCount, totalStars, languages, lastUpdated, githubUrl, loading, error } = useGithubRepositories()
  const [selectedProject, setSelectedProject] = useState(null)
  const archiveTrackRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  const repositoryByName = useMemo(
    () => new Map(repositories.map((repository) => [repository.name.toLowerCase(), repository])),
    [repositories],
  )
  const resolveProject = useCallback((project) => {
    const repositoryName = project.githubUrl.split('/').pop()?.toLowerCase()
    const repository = repositoryName ? repositoryByName.get(repositoryName) : null
    return {
      ...project,
      githubUrl: repository?.html_url || project.githubUrl,
      liveUrl: project.liveUrl || repository?.homepage || '',
    }
  }, [repositoryByName])
  const githubProjects = useMemo(() => {
    const featuredRepositoryNames = new Set(featuredProjects.map((project) => project.githubUrl.split('/').pop()?.toLowerCase()))
    return repositories.filter((repository) => !featuredRepositoryNames.has(repository.name.toLowerCase())).slice(0, 4)
  }, [repositories])
  const resolvedFeaturedProjects = useMemo(() => featuredProjects.map(resolveProject), [resolveProject])
  const pinnedProjects = useMemo(() => featuredProjects.map(resolveProject), [resolveProject])

  const openProject = useCallback((project) => setSelectedProject(project), [])
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const scrollArchive = useCallback((direction) => {
    archiveTrackRef.current?.scrollBy({ left: direction * 360, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }, [shouldReduceMotion])
  const updateHeroParallax = useCallback((event) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--parallax-x', `${x * 10}px`)
    event.currentTarget.style.setProperty('--parallax-y', `${y * 10}px`)
    event.currentTarget.style.setProperty('--parallax-reverse-x', `${x * -7}px`)
    event.currentTarget.style.setProperty('--parallax-reverse-y', `${y * -7}px`)
  }, [shouldReduceMotion])
  const resetHeroParallax = useCallback((event) => {
    event.currentTarget.style.setProperty('--parallax-x', '0px')
    event.currentTarget.style.setProperty('--parallax-y', '0px')
    event.currentTarget.style.setProperty('--parallax-reverse-x', '0px')
    event.currentTarget.style.setProperty('--parallax-reverse-y', '0px')
  }, [])

  return (
    <>
      <AnimatedCursor />
      <section className="hero-section" id="home">
        <div className="hero-backdrop" aria-hidden="true"><span /><span /></div>
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            Open to early-career opportunities <i /> {profile.location}
          </p>
          <h1>
            <span className="hero-greeting">Hi, I&apos;m</span>
            <span className="hero-name">Sivakumar<span className="hero-period">.</span></span>
            <HeroRole />
          </h1>
          <p className="hero-intro">
            Java full stack developer focused on Spring Boot, REST APIs, authentication, microservices, React, and the details that make software scale with confidence.
          </p>
          <div className="hero-actions">
            <MagneticButton to="/projects" className="button button-primary">View projects <span aria-hidden="true">↗</span></MagneticButton>
            <MagneticButton href={profile.resumeDownload} className="button button-secondary" target="_blank" rel="noreferrer">Download resume <span aria-hidden="true">↓</span></MagneticButton>
            <MagneticButton to="/contact" className="button button-quiet">Let&apos;s talk</MagneticButton>
          </div>
          <div className="hero-socials">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={`mailto:${profile.email}`}>Email <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="hero-visual" onPointerMove={updateHeroParallax} onPointerLeave={resetHeroParallax}>
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <ProfileImage />
          {heroTechnologies.map((technology, index) => (
            <motion.span
              key={technology}
              className={`floating-tech floating-tech-${index + 1}`}
              animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
            >
              <i aria-hidden="true" />{technology}
            </motion.span>
          ))}
          <span className="hero-coordinate">17° 23&apos; N&nbsp; / &nbsp;78° 29&apos; E</span>
        </div>
        <a className="scroll-cue" href="#about" aria-label="Scroll to about section"><span />Scroll to explore</a>
      </section>

      <section id="projects" className="content-section projects-section">
        <SectionHeading
          number="01"
          title={<>Selected work,<br /><em>built with intent.</em></>}
          description="A closer look at the product thinking, architecture, and practical decisions behind my featured projects."
          eyebrow="Featured projects"
        />
        <div className="project-list">
          {resolvedFeaturedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={openProject} />
          ))}
        </div>
      </section>

      <section className="intro-band" aria-label="Professional summary">
        <span className="intro-index">00 / The short version</span>
        <p>Backend-minded. Product curious. Building dependable systems and clear interfaces.</p>
        <span className="intro-location">{profile.location}</span>
      </section>

      <section id="about" className="content-section about-section">
        <SectionHeading
          number="03"
          title={<>Good software starts<br />with <em>clear thinking.</em></>}
          description="I enjoy the parts of engineering where thoughtful structure meets a real user need."
          eyebrow="A little about me"
        />
        <div className="about-grid">
          <Reveal className="about-story">
            <ProfileAvatar className="about-avatar" alt={`${profile.name} at work`} />
            <p className="story-lead">I&apos;m Sivakumar, a computer science graduate building my career in full-stack engineering—with a strong pull toward the backend.</p>
            <div className="story-columns">
              <p>Java drew me in because it rewards clear models and deliberate problem-solving. Spring Boot gave me a practical way to turn that foundation into APIs, authentication flows, and services that work together.</p>
              <p>React has broadened my perspective: good engineering includes the experience around the system, too. I keep learning by shipping projects, revisiting decisions, and making each iteration more useful. My next goal is to join a team where I can contribute, grow with feedback, and help deliver software people rely on.</p>
            </div>
            <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">More about my journey <span aria-hidden="true">↗</span></a>
          </Reveal>
          <Reveal className="about-facts" delay={0.1}>
            <div className="fact-card">
              <span>Education</span>
              <strong>{education.degree}</strong>
              <small>{education.school} · {education.university}</small>
              <small>{education.period} · {education.grade}</small>
            </div>
            <div className="fact-card">
              <span>Current direction</span>
              <strong>Java backend & full stack</strong>
              <small>Spring Boot · APIs · React</small>
            </div>
            <div className="fact-card">
              <span>How I work</span>
              <strong>Learn by building</strong>
              <small>Curiosity, iteration, and attention to detail.</small>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="skills" className="content-section skills-section">
        <SectionHeading
          number="02"
          title={<>Tools for turning<br /><em>ideas into software.</em></>}
          description="A growing toolkit across application development, data, and the everyday craft of shipping."
          eyebrow="Skills & craft"
        />
        <div className="skills-grid">
          {skillGroups.map(([number, title, skills], index) => (
            <SkillGroupCard key={title} number={number} title={title} skills={skills} delay={index * 0.06} />
          ))}
        </div>
      </section>

      <section id="archive" className="content-section archive-section">
        <div className="archive-heading">
          <SectionHeading
            number="04"
            title={<>Curiosity, in<br /><em>many small forms.</em></>}
            description="Experiments, interfaces, and learning projects that helped me build range."
            eyebrow="Project archive"
          />
          <div className="archive-controls" aria-label="Project archive controls">
            <button type="button" onClick={() => scrollArchive(-1)} aria-label="Scroll projects left">←</button>
            <button type="button" onClick={() => scrollArchive(1)} aria-label="Scroll projects right">→</button>
          </div>
        </div>
        <div className="archive-track" ref={archiveTrackRef}>
          {archiveProjects.map((project) => (
            <ArchiveProjectCard key={project.id} project={resolveProject(project)} />
          ))}
        </div>
        <p className="archive-note">A selection of side projects and interface experiments <span>— drag or scroll to explore</span></p>
      </section>

      <section id="github" className="content-section github-section">
        <SectionHeading
          number="05"
          title={<>Open source.<br /><em>Open process.</em></>}
          description="My GitHub is where I work through ideas, build projects, and share what I am learning."
          eyebrow="GitHub"
        />
        <div className="github-overview">
          <div className="github-profile-card">
            <div className="github-profile-top">
              <span className="github-monogram">SK</span>
              <a href={githubUrl || profile.github} target="_blank" rel="noreferrer" className="text-link">View GitHub profile <span aria-hidden="true">↗</span></a>
            </div>
            <h3>{profile.name}</h3>
            <p>Java Full Stack Developer · building in public</p>
            <div className="github-stats">
              <div><strong>{loading ? '—' : error ? '—' : repositoryCount}</strong><span>Public repositories</span></div>
              <div><strong>{loading ? '—' : error ? '—' : totalStars}</strong><span>Stars across repositories</span></div>
              <div><strong>{languages.length ? languages.join(' · ') : '—'}</strong><span>Recent technologies</span></div>
            </div>
            <a className="activity-link" href={`${githubUrl || profile.github}?tab=overview`} target="_blank" rel="noreferrer">
              <span><i aria-hidden="true" /> Activity & contribution graph</span><span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="github-repositories">
            <div className="github-repositories-heading">
              <span>Recently updated public repositories</span>
              {lastUpdated && <small>Latest repository update · {formatUpdatedDate(lastUpdated)}</small>}
            </div>
            {loading && <p className="github-state" role="status">Loading public repositories…</p>}
            {error && <p className="github-state" role="status">{error}             <a href={githubUrl || profile.github} target="_blank" rel="noreferrer">Browse GitHub directly ↗</a></p>}
            {!loading && !error && (
              <div className="github-grid">
                {githubProjects.map((repository) => <GitHubRepoCard key={repository.id} repository={repository} />)}
              </div>
            )}
          </div>
        </div>
        <div className="github-pinned">
          <div className="github-pinned-heading">
            <span>Pinned project repositories</span>
            <a href={`${githubUrl || profile.github}?tab=repositories`} target="_blank" rel="noreferrer">All repositories ↗</a>
          </div>
          <div className="pinned-grid">
            {pinnedProjects.map((project) => (
              <a key={project.id} className="pinned-repo" href={project.githubUrl} target="_blank" rel="noreferrer">
                <span className="pinned-repo-icon" aria-hidden="true">⌘</span>
                <span><strong>{project.title}</strong><small>{project.technologies.slice(0, 3).join(' · ')}</small></span>
                <span className="repo-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="content-section journey-section">
        <SectionHeading
          number="06"
          title={<>A journey of<br /><em>steady progress.</em></>}
          description="From a computer science foundation to building real applications and preparing for the next chapter."
          eyebrow="Learning timeline"
        />
        <JourneyTimeline milestones={journeyMilestones} />
      </section>

      <section id="resume" className="content-section resume-section">
        <Reveal className="resume-card">
          <div className="resume-copy">
            <p className="eyebrow"><span>07</span>Resume</p>
            <h2>Clear experience.<br /><em>Ready to review.</em></h2>
            <p>A concise overview of my education, projects, and technical focus—prepared for a quick recruiter scan.</p>
            <div className="resume-actions">
              <a href={profile.resume} className="button button-primary" target="_blank" rel="noreferrer">View resume <span aria-hidden="true">↗</span></a>
              <a href={profile.resumeDownload} className="button button-secondary" target="_blank" rel="noreferrer">Download PDF <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="resume-preview-card">
            <ProfileAvatar className="resume-avatar" alt={`${profile.name} resume portrait`} />
            <span className="resume-seal">ATS<br />READY</span>
            <span className="resume-preview-label">SIVAKUMAR EEKALPA</span>
            <span className="resume-preview-rule" />
            <span className="resume-preview-role">JAVA FULL STACK DEVELOPER</span>
            <span className="resume-preview-lines"><i /><i /><i /><i /></span>
            <span className="resume-preview-tags">JAVA&nbsp; · &nbsp;SPRING&nbsp; · &nbsp;REACT</span>
          </div>
        </Reveal>
        <ResumeViewer />
      </section>

      <section id="contact" className="content-section contact-section">
        <SectionHeading
          number="08"
          title={<>Let&apos;s make<br /><em>something useful.</em></>}
          description="If you are building a team or a product that could use a curious Java full stack developer, I would love to connect."
          eyebrow="Start a conversation"
        />
        <div className="contact-grid">
          <Reveal className="contact-panel">
            <ProfileAvatar className="contact-avatar" alt={`${profile.name} profile`} />
            <span className="contact-kicker">Have a role in mind?</span>
            <h3>Good work begins with a conversation.</h3>
            <p>I&apos;m open to early-career opportunities, internships, and thoughtful collaborations in Java, backend, and full-stack development.</p>
            <div className="contact-links">
              <a href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
              <a href={`tel:${profile.phone}`}>{profile.phone} <span aria-hidden="true">↗</span></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn profile <span aria-hidden="true">↗</span></a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </section>

      <ProjectDetailsModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
