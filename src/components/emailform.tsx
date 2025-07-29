'use client'

import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useRouter } from 'next/navigation'

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

export const EmailForm = () => {
  const [state, setState] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": form.getAttribute("name") || "",
          ...state,
        }),
      })
      router.push(form.getAttribute("action") || "/thanks")
    } catch (error) {
      alert("There was an error submitting the form. Please try again.")
      console.error(error)
    }
  }

  return (
    <Container fluid="xl" className="mt-5">
      <Container className="text-center container-email-form pt-5">
        <h2 className="h2 pb-3">Subscribe below to receive updates</h2>
        <form
          name="contact"
          method="post"
          action="/thanks/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="my-auto py-5"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don&apos;t fill this out:{" "}
              <input name="bot-field" onChange={handleChange} />
            </label>
          </p>
          <p className="pb-3">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="input"
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <button
              type="submit"
              className="shape-pill large-button hot"
              aria-label="Click here to subscribe!"
            >
              Send
            </button>
          </p>
        </form>
      </Container>
    </Container>
  )
}