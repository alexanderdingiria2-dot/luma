import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body || {}

    // E-Mail ist optional - wenn vorhanden, validieren
    let customerEmail = null
    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(email)) {
        customerEmail = email
      }
    }

    // E-Mail-Versand an business.luma.toys@gmail.com
    const smtpPassword = process.env.SMTP_PASSWORD
    const smtpUser = process.env.SMTP_USER || 'business.luma.toys@gmail.com'
    
    if (!smtpPassword || smtpPassword.trim() === '') {
      console.error('❌ SMTP_PASSWORD is not set!')
      return NextResponse.json(
        { error: 'Email service not configured. Please set SMTP_PASSWORD in .env.local.' },
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

      // E-Mail an uns: Kaufversuch
      const mailOptions: any = {
        from: `"Luma Waitlist" <${smtpUser}>`,
        to: 'business.luma.toys@gmail.com',
        subject: customerEmail ? `🛒 Purchase attempt: ${customerEmail}` : '🛒 Purchase attempt (no email provided)',
        text: customerEmail 
          ? `Someone tried to purchase Luma:\n\nEmail: ${customerEmail}\nDate: ${new Date().toLocaleString('en-US')}\n\nReply directly to this email to contact the customer.`
          : `Someone tried to purchase Luma:\n\nDate: ${new Date().toLocaleString('en-US')}\n\nNo email address was provided.`,
        html: customerEmail
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">🛒 Purchase attempt</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Email address:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
                <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-US')}</p>
              </div>
              <p style="color: #666; font-size: 14px;">Reply directly to this email to contact the customer.</p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">🛒 Purchase attempt</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-US')}</p>
                <p style="margin: 10px 0; color: #666;">No email address was provided.</p>
              </div>
            </div>
          `,
      }

      if (customerEmail) {
        mailOptions.replyTo = customerEmail
      }

      const businessMailResult = await transporter.sendMail(mailOptions)

      console.log('✅ E-Mail an business.luma.toys@gmail.com gesendet')
      console.log('   Message ID:', businessMailResult.messageId)
      console.log('   Empfänger:', businessMailResult.accepted)
    } catch (emailError: any) {
      console.error('❌ FEHLER beim Senden der E-Mail:')
      console.error('   Fehlertyp:', emailError.code || 'UNKNOWN')
      console.error('   Fehlermeldung:', emailError.message)
      console.error('   Response:', emailError.response)
      console.error('   Response Code:', emailError.responseCode)
      
      // Specific error messages
      let errorMessage = 'Email could not be sent.'
      
      if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
        errorMessage = 'Authentication error. Gmail requires an app password (not the regular password). See GMAIL_SETUP.md for instructions.'
      } else if (emailError.code === 'ECONNECTION' || emailError.code === 'ETIMEDOUT') {
        errorMessage = 'Connection error. Please check your internet connection.'
      } else if (emailError.responseCode === 534) {
        errorMessage = 'Two-factor authentication required. Please enable 2FA and create an app password. See GMAIL_SETUP.md'
      } else if (emailError.message?.includes('Invalid login') || emailError.message?.includes('Username and Password not accepted')) {
        errorMessage = 'Gmail does not accept regular passwords. You must create an app password. See GMAIL_SETUP.md'
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        },
        { status: 500 }
      )
    }

    // E-Mail in JSON-Datei speichern für Statistiken (nur wenn E-Mail vorhanden)
    if (customerEmail) {
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
          email: customerEmail,
          timestamp: new Date().toISOString(),
        })
        
        // Speichere zurück in Datei
        await fs.writeFile(filePath, JSON.stringify(emails, null, 2), 'utf-8')
        
        console.log(`✅ E-Mail gespeichert. Gesamt: ${emails.length} E-Mails`)
      } catch (fileError) {
        console.error('⚠️ Fehler beim Speichern der E-Mail:', fileError)
        // Weiter, auch wenn Speichern fehlschlägt
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

