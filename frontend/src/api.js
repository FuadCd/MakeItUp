const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api')

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

export function generatePost(activity) {
  return request('/generate', { activity })
}

export function generateVariation(activity) {
  return request('/generate', { activity })
}

export function generateJobs() {
  return request('/generate-jobs', {})
}

export function generateHeadlines() {
  return request('/generate-headlines', {})
}
