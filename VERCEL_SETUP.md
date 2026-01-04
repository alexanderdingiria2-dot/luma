# Vercel Deployment - Umgebungsvariablen einrichten

## Problem
Auf Vercel funktioniert `.env.local` nicht, weil diese Datei nicht ins Repository committed wird. Die Umgebungsvariablen müssen direkt in den Vercel-Einstellungen konfiguriert werden.

## Lösung: Umgebungsvariablen auf Vercel setzen

### Schritt 1: Gehe zu deinem Vercel-Projekt

1. Öffne https://vercel.com
2. Wähle dein Projekt aus
3. Gehe zu **Settings** → **Environment Variables**

### Schritt 2: Füge die benötigten Umgebungsvariablen hinzu

Füge folgende Variablen hinzu:

#### Erforderlich:
- **Name**: `SMTP_PASSWORD`
- **Value**: Dein Gmail App-Passwort (16-stellig, z.B. `abcd efgh ijkl mnop`)
- **Environment**: Wähle alle aus (Production, Preview, Development)

#### Optional (haben Standardwerte):
- **Name**: `SMTP_USER`
- **Value**: `business.luma.toys@gmail.com`
- **Environment**: Alle

- **Name**: `SMTP_HOST`
- **Value**: `smtp.gmail.com`
- **Environment**: Alle

- **Name**: `SMTP_PORT`
- **Value**: `587`
- **Environment**: Alle

### Schritt 3: Gmail App-Passwort erstellen (falls noch nicht geschehen)

Falls du noch kein App-Passwort hast:

1. Gehe zu: https://myaccount.google.com/apppasswords
2. Wähle:
   - **App**: "Mail"
   - **Gerät**: "Anderer (Benutzerdefiniert)"
   - **Name**: "Luma Vercel"
   - Klicke auf **"Generieren"**
3. Kopiere das **16-stellige Passwort** (ohne Leerzeichen, z.B. `abcdefghijklmnop`)
4. Füge es als `SMTP_PASSWORD` in Vercel ein

### Schritt 4: Deployment neu starten

Nach dem Hinzufügen der Umgebungsvariablen:

1. Gehe zu **Deployments**
2. Klicke auf die drei Punkte (⋯) bei deinem letzten Deployment
3. Wähle **Redeploy**
4. Oder pushe einen neuen Commit

**WICHTIG**: Nach dem Setzen der Variablen muss das Deployment neu gestartet werden, damit die neuen Umgebungsvariablen geladen werden!

## Überprüfen

Nach dem Redeploy sollte der "Buy Now" Button funktionieren und E-Mails an `business.luma.toys@gmail.com` senden.

## Hilfe

Falls es immer noch nicht funktioniert:
- Überprüfe in den Vercel-Logs (Deployments → Deploy wählen → Logs), ob `SMTP_PASSWORD` gesetzt ist
- Stelle sicher, dass du das App-Passwort (nicht das normale Gmail-Passwort) verwendest
- Überprüfe, dass 2-Faktor-Authentifizierung für dein Gmail-Konto aktiviert ist

