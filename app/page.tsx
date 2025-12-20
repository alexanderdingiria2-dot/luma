'use client'

import { useState } from 'react'

type Step = 'initial' | 'email' | 'success'

export default function Home() {
  const [step, setStep] = useState<Step>('initial')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleBuyClick = () => {
    setStep('email')
    setError('')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error sending email')
      }

      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('initial')
    setEmail('')
    setError('')
  }

  return (
    <main className="hero">
      <div className="video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/luma.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      <div className="content">
        {step === 'initial' && (
          <div className="step-initial">
            <h1 className="title">Luma – your smart friend for the kids' room</h1>
            <p className="subtitle">
              Luma answers questions, listens, and playfully accompanies children through everyday life.
            </p>
            <div className="price">€60</div>
            <button
              onClick={handleBuyClick}
              className="cta-button"
              aria-label="Buy now for 60 euros"
            >
              Buy now – €60
            </button>
          </div>
        )}

        {step === 'email' && (
          <div className="step-email">
            <form onSubmit={handleEmailSubmit} className="email-form">
              <label htmlFor="email" className="email-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="your@email.com"
                className="email-input"
                required
                autoFocus
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'email-error' : undefined}
              />
              {error && (
                <p id="email-error" className="error-message" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!isValidEmail(email) || isLoading}
                className="submit-button"
                aria-label="Buy now for 60 euros"
              >
                {isLoading ? 'Sending...' : 'Buy now – €60'}
              </button>
              <p className="microcopy">No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="step-success">
            <p className="success-message">
              Unfortunately, our product is sold out.
              <br />
              We'll notify you when a new product is available.
            </p>
            <button
              onClick={handleBack}
              className="back-button"
              aria-label="Back to homepage"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

