# GitHub Pages Setup für EINS Meditation PWA

## 🚀 Schritt-für-Schritt Anleitung

### 1. Repository auf GitHub erstellen

1. Gehen Sie zu https://github.com
2. Klicken Sie auf das **+** Symbol (oben rechts) → **New repository**
3. **Repository name:** `eins-meditation` (oder ein anderer Name Ihrer Wahl)
4. **Description:** `EINS - Digitale Meditation PWA`
5. **Public** auswählen (für GitHub Pages erforderlich)
6. **NICHT** "Add a README file" ankreuzen (wir haben bereits eins)
7. **Create repository** klicken

### 2. Lokales Repository mit GitHub verbinden

Führen Sie diese Befehle in Ihrem Terminal aus:

```bash
# Git Repository initialisieren
git init

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "EINS Meditation PWA - Initial commit"

# Main Branch erstellen
git branch -M main

# Remote Repository hinzufügen (ERSETZEN Sie IHR-BENUTZERNAME)
git remote add origin https://github.com/IHR-BENUTZERNAME/eins-meditation.git

# Code zu GitHub hochladen
git push -u origin main
```

### 3. GitHub Pages aktivieren

1. Gehen Sie zu Ihrem Repository auf GitHub
2. Klicken Sie auf **Settings** (oben im Repository-Menü)
3. Scrollen Sie runter zu **Pages** (linke Seitenleiste)
4. Unter **Source**:
   - Wählen Sie **Deploy from a branch**
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Klicken Sie **Save**

### 4. Warten und testen

- GitHub braucht 2-10 Minuten zum Deployment
- Ihre App ist dann verfügbar unter: `https://IHR-BENUTZERNAME.github.io/eins-meditation/`

## ❌ Häufige Probleme und Lösungen

### Problem: "Repository ist private"
- **Lösung:** Repository muss **Public** sein für kostenlose GitHub Pages

### Problem: "Pages Tab nicht sichtbar"
- **Lösung:** Stellen Sie sicher, dass Sie **Settings** des Repositories öffnen, nicht Ihr Profil

### Problem: "Source-Option nicht verfügbar"
- **Lösung:** Repository muss mindestens einen Commit im main Branch haben

### Problem: "404 Fehler beim Öffnen der Seite"
- **Lösung:** Warten Sie 5-10 Minuten, GitHub braucht Zeit für das erste Deployment

### Problem: "Deployment fehlgeschlagen"
- **Lösung:** Überprüfen Sie die **Actions** Tab auf Fehler

## ✅ Verifikation

Nach dem Setup sollten Sie sehen:
- Grüner Haken bei GitHub Actions
- URL wird in den Pages Settings angezeigt
- PWA funktioniert unter der GitHub Pages URL

## 🔧 Alternative: GitHub CLI (falls verfügbar)

```bash
# Repository erstellen mit GitHub CLI
gh repo create eins-meditation --public --source=. --remote=origin --push
```