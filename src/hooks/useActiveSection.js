import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    let frame
    let observer
    let attempts = 0

    const observeSections = () => {
      const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

      if (!sections.length && attempts < 120) {
        attempts += 1
        frame = window.requestAnimationFrame(observeSections)
        return
      }

      if (!sections.length) return

      observer = new IntersectionObserver((entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)

        if (visibleSections[0]) setActiveSection(visibleSections[0].target.id)
      }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })

      sections.forEach((section) => observer.observe(section))
    }

    frame = window.requestAnimationFrame(observeSections)
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [sectionIds])

  return activeSection
}
