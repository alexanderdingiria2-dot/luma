# Gmail E-Mail-Versand einrichten

## Problem
Gmail akzeptiert für SMTP-Verbindungen **kein normales Passwort** mehr. Du musst ein **App-Passwort** erstellen.

## Lösung: App-Passwort erstellen

### Schritt 1: 2-Faktor-Authentifizierung aktivieren (falls noch nicht aktiviert)

1. Gehe zu: https://myaccount.google.com/security
2. Scrolle zu "Bei Google anmelden"
3. Aktiviere "Bestätigung in zwei Schritten" (falls noch nicht aktiviert)

### Schritt 2: App-Passwort erstellen

1. Gehe zu: https://myaccount.google.com/apppasswords
   - Falls du die Seite nicht siehst, musst du zuerst 2-Faktor-Authentifizierung aktivieren (siehe Schritt 1)

2. Wähle:
   - **App**: "Mail"
   - **Gerät**: "Anderer (Benutzerdefiniert)"
   - **Name**: "Luma Waitlist"
   - Klicke auf **"Generieren"**

3. Kopiere das **16-stellige Passwort** (z.B. `abcd efgh ijkl mnop`)

### Schritt 3: Passwort in .env.local eintragen

1. Öffne die Datei `.env.local` im Projektordner
2. Ersetze die Zeile:
   ```
   SMTP_PASSWORD=Luma1234
   ```
   durch:
   ```
   SMTP_PASSWORD=abcd efgh ijkl mnop
   ```
   (Verwende das Passwort, das du in Schritt 2 erhalten hast)

3. **WICHTIG**: Keine Anführungszeichen verwenden!

4. Starte den Server neu:
   ```bash
   npm run dev
   ```

## Testen

Nach dem Einrichten kannst du testen, ob es funktioniert:
1. Öffne die Landingpage
2. Gib eine Test-E-Mail ein
3. Du solltest sofort eine E-Mail an `business.luma.toys@gmail.com` erhalten

## Hilfe

Falls es nicht funktioniert:
- Überprüfe, ob 2-Faktor-Authentifizierung aktiviert ist
- Stelle sicher, dass du das App-Passwort (nicht das normale Passwort) verwendest
- Schaue in die Server-Konsole für Fehlermeldungen

