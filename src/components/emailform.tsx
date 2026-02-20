'use client'

import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const EmailForm = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/thanks')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid="xl" className="mt-5">
      <Container className="text-center container-email-form pt-5">
        <h2 className="h2 pb-3">Subscribe below to receive updates</h2>
        <form
          name="contact"
          className="my-auto py-5"
          onSubmit={handleSubmit}
        >
          <p className="pb-3">
            <input
              type="email"
              name="email"
              value={email}
              placeholder="your@email.com"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </p>

          {error && (
            <p className="caption" style={{ color: 'red' }}>{error}</p>
          )}

          <p>
            <button
              type="submit"
              className="shape-pill large-button hot"
              aria-label="Click here to subscribe!"
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </p>
        </form>
      </Container>
    </Container>
  )
}
