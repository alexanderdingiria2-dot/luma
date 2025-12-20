'use client'

import { useEffect, useState } from 'react'

interface Stats {
  total: number
  unique: number
  today: number
  emails: Array<{ email: string; timestamp: string }>
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('Fehler beim Laden')
      const data = await response.json()
      setStats(data)
      setError('')
    } catch (err) {
      setError('Fehler beim Laden der Statistiken')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
    // Aktualisiere alle 5 Sekunden
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Lade Statistiken...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Luma Waitlist Statistiken</h1>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
            {stats?.total || 0}
          </div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>
            Gesamt E-Mails
          </div>
        </div>
        
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
            {stats?.unique || 0}
          </div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>
            Eindeutige E-Mails
          </div>
        </div>
        
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
            {stats?.today || 0}
          </div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>
            Heute
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Alle E-Mails</h2>
        <button
          onClick={loadStats}
          style={{
            padding: '0.5rem 1rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Aktualisieren
        </button>
      </div>

      {stats && stats.emails.length > 0 ? (
        <div style={{ 
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>#</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>E-Mail</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Datum & Uhrzeit</th>
              </tr>
            </thead>
            <tbody>
              {stats.emails.map((entry, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{stats.emails.length - index}</td>
                  <td style={{ padding: '1rem' }}>{entry.email}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {new Date(entry.timestamp).toLocaleString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          Noch keine E-Mails erfasst.
        </p>
      )}
    </div>
  )
}

