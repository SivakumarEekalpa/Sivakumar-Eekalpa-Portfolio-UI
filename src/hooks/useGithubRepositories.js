import { useEffect, useState } from 'react'

const endpoint = 'https://api.github.com/users/SivakumarEekalpa/repos?sort=updated&per_page=100'

const priorityScore = (repo) => {
  const searchable = `${repo.name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase()
  return ['java', 'spring', 'react', 'microservice', 'bookstore', 'chatbot'].reduce((score, keyword) => score + (searchable.includes(keyword) ? 1 : 0), 0)
}

export function useGithubRepositories() {
  const [state, setState] = useState({ repositories: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub repositories are temporarily unavailable.')
        return response.json()
      })
      .then((repositories) => setState({ repositories: repositories.filter((repo) => !repo.fork).sort((left, right) => priorityScore(right) - priorityScore(left) || new Date(right.updated_at) - new Date(left.updated_at)), loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ repositories: [], loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [])

  return state
}