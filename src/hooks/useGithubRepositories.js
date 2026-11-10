import { useEffect, useState } from 'react'

const endpoint = 'https://api.github.com/users/SivakumarEekalpa/repos?sort=updated&per_page=100'
const profileEndpoint = 'https://api.github.com/users/SivakumarEekalpa'

export function useGithubRepositories() {
  const [state, setState] = useState({
    repositories: [],
    repositoryCount: null,
    totalStars: 0,
    languages: [],
    lastUpdated: null,
    githubUrl: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetch(profileEndpoint, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }),
      fetch(endpoint, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }),
    ])
      .then(async ([profileResponse, repositoryResponse]) => {
        if (!profileResponse.ok || !repositoryResponse.ok) throw new Error('GitHub repositories are temporarily unavailable.')
        const [profile, repositories] = await Promise.all([profileResponse.json(), repositoryResponse.json()])
        return { profile, repositories }
      })
      .then(({ profile, repositories }) => {
        if (!Array.isArray(repositories)) throw new Error('GitHub returned an unexpected repository response.')

        const sortedRepositories = repositories
          .filter((repository) => !repository.fork)
          .sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at))
        const languageCounts = sortedRepositories.reduce((counts, repository) => {
          if (repository.language) counts.set(repository.language, (counts.get(repository.language) || 0) + 1)
          return counts
        }, new Map())
        const lastUpdated = sortedRepositories.reduce(
          (latest, repository) => (!latest || repository.updated_at > latest ? repository.updated_at : latest),
          null,
        )

        setState({
          repositories: sortedRepositories,
          repositoryCount: profile.public_repos,
          totalStars: sortedRepositories.reduce((total, repository) => total + repository.stargazers_count, 0),
          languages: [...languageCounts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 4).map(([name]) => name),
          lastUpdated,
          githubUrl: profile.html_url,
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState((current) => ({ ...current, loading: false, error: error.message }))
        }
      })

    return () => controller.abort()
  }, [])

  return state
}
