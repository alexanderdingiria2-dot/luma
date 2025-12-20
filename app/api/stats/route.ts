import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'waitlist.json')
    
    // Lese E-Mails aus Datei
    let emails: Array<{ email: string; timestamp: string }> = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      emails = JSON.parse(fileContent)
    } catch {
      // Datei existiert noch nicht
    }
    
    // Berechne Statistiken
    const total = emails.length
    const uniqueEmails = new Set(emails.map(e => e.email.toLowerCase())).size
    const today = new Date().toISOString().split('T')[0]
    const todayCount = emails.filter(e => e.timestamp.startsWith(today)).length
    
    return NextResponse.json({
      total,
      unique: uniqueEmails,
      today: todayCount,
      emails: emails.reverse(), // Neueste zuerst
    })
  } catch (error) {
    console.error('Fehler beim Lesen der Statistiken:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    )
  }
}

