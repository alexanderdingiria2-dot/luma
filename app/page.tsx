'use client'

import { useState } from 'react'

type Step = 'initial' | 'success'

export default function Home() {
  const [step, setStep] = useState<Step>('initial')
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyClick = async () => {
    setIsLoading(true)

    try {
      // Sende Benachrichtigung an uns (ohne E-Mail vom Kunden)
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ E-Mail-Versand fehlgeschlagen:', data.error)
        console.error('Details:', data.details)
        // Zeige trotzdem Ausverkauft-Meldung an
      } else {
        console.log('✅ E-Mail erfolgreich versendet')
      }

      // Zeige Ausverkauft-Meldung an, auch wenn API-Fehler auftritt
      setStep('success')
    } catch (err: any) {
      console.error('❌ Fehler beim Senden der E-Mail:', err)
      // Zeige trotzdem Ausverkauft-Meldung
      setStep('success')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('initial')
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Images - Orientation-based switching */}
        <img
          src="/Desktop.png"
          alt="Luma product"
          className="hero-background-image hero-image-desktop"
          loading="eager"
          decoding="async"
        />
        <img
          src="/Mobile.png"
          alt="Luma product"
          className="hero-background-image hero-image-mobile"
          loading="eager"
          decoding="async"
        />

        {/* Right-side Readability Overlay */}
        <div className="hero-readability-overlay" />
        
        {/* Top Gradient Overlay */}
        <div className="hero-top-overlay" />

        {/* Subtle Brand Badge */}
        <div className="hero-brand-badge">Luma</div>

        {/* Hero Content - Right Side */}
        <div className="hero-content">
          <div className="hero-glass-card">
            <h1 className="hero-title">Luma</h1>
            <p className="hero-subtitle">A smart, emotional companion for kids.</p>
            <div className="hero-price-badge">
              <span className="price-amount">€29</span>
              <span className="price-separator"> • </span>
              <span className="stock-info">Only 10 left in stock</span>
            </div>
            <div className="hero-cta-group">
              <button
                onClick={handleBuyClick}
                className="cta-button primary"
                aria-label="Buy now for 29 euros"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Buy now — €29'}
              </button>
              <button
                onClick={scrollToFeatures}
                className="cta-button secondary"
                aria-label="Learn more about Luma"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Luma Section */}
      <section className="section why-section">
        <div className="container">
          <p className="why-text">
            More than a toy. Luma listens, responds, and grows with your child.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Kid-friendly answers</h3>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Listens & supports</h3>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Playful emotional reactions</h3>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="section how-it-works-section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Turn on Luma</h3>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Set your child's age</h3>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Start talking & playing</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Offer / Pricing Section */}
      <section className="section offer-section">
        <div className="container">
          <div className="offer-content">
            <h2 className="offer-title">€29 — Limited first edition</h2>
            <p className="offer-stock">Only 10 left in stock</p>
            <button
              onClick={handleBuyClick}
              className="cta-button primary large"
              aria-label="Buy now for 29 euros"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Buy now — €29'}
            </button>
            <p className="offer-trust">One-time payment · No subscription</p>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {step === 'success' && (
        <div className="modal-overlay" onClick={handleBack}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-content">
              <p className="success-message">
                Unfortunately, our product is sold out.
                <br />
                We'll notify you when a new product is available.
              </p>
              <button
                onClick={handleBack}
                className="cta-button primary"
                aria-label="Back to homepage"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Imprint / Legal Notice Section */}
      <section className="section imprint-section">
        <div className="container">
          <h2 className="imprint-title">Imprint (Legal Notice)</h2>
          <div className="imprint-content">
            <p><strong>Information according to § 5 TMG (Germany)</strong></p>
            <p>Name: Alexander Dingiria</p>
            <p>Address: Edelweißstr 7, 83109 Großkarolinenfeld</p>
            <p>Email: <a href="mailto:alexander.dingiria2@gmail.com">alexander.dingiria2@gmail.com</a></p>
            <p style={{ marginTop: '1.5rem' }}>
              <strong>Responsible for content according to § 55 (2) RStV:</strong>
            </p>
            <p>Alexander Dingiria</p>
          </div>
        </div>
      </section>
    </>
  )
}
