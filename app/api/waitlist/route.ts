import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Email-Validierung
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    // E-Mail-Versand an business.luma.toys@gmail.com
    const smtpPassword = process.env.SMTP_PASSWORD
    const smtpUser = process.env.SMTP_USER || 'business.luma.toys@gmail.com'
    
    if (!smtpPassword || smtpPassword.trim() === '') {
      console.error('❌ SMTP_PASSWORD ist nicht gesetzt!')
      return NextResponse.json(
        { error: 'E-Mail-Service nicht konfiguriert. Bitte SMTP_PASSWORD in .env.local setzen.' },
        { status: 500 }
      )
    }

    // E-Mail-Versand ist ERFORDERLICH
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true für 465, false für andere Ports
        auth: {
          user: smtpUser,
          pass: smtpPassword.trim(),
        },
        // Timeout erhöhen für langsamere Verbindungen
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      })

      // Teste die Verbindung zuerst
      await transporter.verify()

      // E-Mail sofort senden
      const mailResult = await transporter.sendMail({
        from: `"Luma Waitlist" <${smtpUser}>`,
        to: 'business.luma.toys@gmail.com',
        replyTo: email, // Antworten gehen direkt an den Benutzer
        subject: `🚀 Neue E-Mail von Luma Waitlist: ${email}`,
        text: `Neue E-Mail-Adresse für die Waitlist:\n\nE-Mail: ${email}\nDatum: ${new Date().toLocaleString('de-DE')}\n\nAntworte direkt an diese E-Mail, um den Benutzer zu kontaktieren.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🚀 Neue E-Mail von Luma Waitlist</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>E-Mail-Adresse:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Datum:</strong> ${new Date().toLocaleString('de-DE')}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Antworte direkt auf diese E-Mail, um den Benutzer zu kontaktieren.</p>
          </div>
        `,
      })

      console.log('✅ E-Mail erfolgreich gesendet an business.luma.toys@gmail.com')
      console.log('   E-Mail-Adresse:', email)
      console.log('   Message ID:', mailResult.messageId)
      console.log('   Empfänger:', mailResult.accepted)
    } catch (emailError: any) {
      console.error('❌ FEHLER beim Senden der E-Mail:')
      console.error('   Fehlertyp:', emailError.code || 'UNKNOWN')
      console.error('   Fehlermeldung:', emailError.message)
      console.error('   Response:', emailError.response)
      console.error('   Response Code:', emailError.responseCode)
      
      // Spezifische Fehlermeldungen
      let errorMessage = 'E-Mail konnte nicht gesendet werden.'
      
      if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
        errorMessage = 'Authentifizierungsfehler. Gmail benötigt ein App-Passwort (nicht das normale Passwort). Siehe GMAIL_SETUP.md für Anleitung.'
      } else if (emailError.code === 'ECONNECTION' || emailError.code === 'ETIMEDOUT') {
        errorMessage = 'Verbindungsfehler. Bitte überprüfe deine Internetverbindung.'
      } else if (emailError.responseCode === 534) {
        errorMessage = '2-Faktor-Authentifizierung erforderlich. Bitte aktiviere 2FA und erstelle ein App-Passwort. Siehe GMAIL_SETUP.md'
      } else if (emailError.message?.includes('Invalid login') || emailError.message?.includes('Username and Password not accepted')) {
        errorMessage = 'Gmail akzeptiert kein normales Passwort. Du musst ein App-Passwort erstellen. Siehe GMAIL_SETUP.md'
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        },
        { status: 500 }
      )
    }

    // E-Mail in JSON-Datei speichern für Statistiken
    try {
      const dataDir = path.join(process.cwd(), 'data')
      const filePath = path.join(dataDir, 'waitlist.json')
      
      // Erstelle data-Ordner falls nicht vorhanden
      await fs.mkdir(dataDir, { recursive: true })
      
      // Lese bestehende E-Mails
      let emails: Array<{ email: string; timestamp: string }> = []
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8')
        emails = JSON.parse(fileContent)
      } catch {
        // Datei existiert noch nicht, starte mit leerem Array
      }
      
      // Füge neue E-Mail hinzu
      emails.push({
        email,
        timestamp: new Date().toISOString(),
      })
      
      // Speichere zurück in Datei
      await fs.writeFile(filePath, JSON.stringify(emails, null, 2), 'utf-8')
      
      console.log(`✅ E-Mail gespeichert. Gesamt: ${emails.length} E-Mails`)
    } catch (fileError) {
      console.error('⚠️ Fehler beim Speichern der E-Mail:', fileError)
      // Weiter, auch wenn Speichern fehlschlägt
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Anfrage:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

