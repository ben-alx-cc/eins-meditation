# EINS - Digitale Meditation PWA

Eine minimalistische Progressive Web App für digitale Meditation. Interagiere mit der Leinwand und beobachte, wie aus der Einheit die Vielfalt entsteht.

## ✨ Features

- **🌐 PWA-Funktionalität**: Installierbar als App auf allen Geräten
- **📱 Vollbild-Modus**: Keine Browserleisten, echtes App-Gefühl
- **🔄 Offline-Bereit**: Funktioniert komplett ohne Internetverbindung
- **🍎 iOS-Optimiert**: "Zum Home-Bildschirm hinzufügen" unterstützt
- **👆 Touch-Optimiert**: Perfekt für mobile Geräte
- **🎨 Interaktive Meditation**: Maus-/Touch-Bewegungen erzeugen Partikel und binäre Muster

## 🚀 Installation als App

### iPhone/iPad:
1. Öffne die Website in Safari
2. Tippe auf das Teilen-Symbol (Pfeil nach oben)
3. Wähle "Zum Home-Bildschirm"
4. Die App wird wie eine native App installiert

### Android:
1. Öffne die Website in Chrome
2. Tippe auf das Menü (drei Punkte)
3. Wähle "App installieren" oder "Zum Startbildschirm hinzufügen"

### Desktop:
1. Öffne die Website in Chrome/Edge
2. Klicke auf das Install-Symbol in der Adressleiste
3. Oder: Menü → "App installieren"

## 🛠 Entwicklung

### Lokaler Start:
```bash
# Einfacher HTTP-Server (Python)
python3 -m http.server 8000

# Oder mit Node.js
npx http-server

# Dann öffne: http://localhost:8000
```

### Dateien:
- `index.html` - Haupt-HTML mit PWA Meta-Tags
- `manifest.json` - App-Manifest für Installation
- `service-worker.js` - Service Worker für Offline-Funktionalität
- `icons/` - App-Icons in verschiedenen Größen

## 🌐 GitHub Pages Deployment

1. **Repository erstellen:**
   ```bash
   git init
   git add .
   git commit -m "Initial PWA setup"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/eins-meditation.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren:**
   - Gehe zu Repository → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` → `/ (root)`
   - Speichern

3. **Zugriff:**
   - URL: `https://DEIN-USERNAME.github.io/eins-meditation/`

## 🔧 PWA Features im Detail

### Service Worker:
- Cached alle Dateien für Offline-Nutzung
- Automatische Cache-Updates
- Fallback-Strategien für Netzwerkfehler

### Manifest:
- Fullscreen-Display ohne Browser-UI
- Schwarzes Theme passend zur App
- Verschiedene Icon-Größen für alle Geräte
- Shortcuts für schnellen Zugriff

### Mobile Optimierungen:
- Touch-Events für Interaktion
- Verhindert Zooming und Scrollen
- Orientierungsänderungen werden behandelt
- Context-Menu wird deaktiviert

## 🎨 Anpassungen

### Icons ändern:
```bash
python3 generate_icons.py
```

### Cache-Version aktualisieren:
Ändere `CACHE_NAME` in `service-worker.js` nach Updates.

### Farben anpassen:
Ändere `theme_color` und `background_color` in `manifest.json`.

## 📱 Test auf Geräten

### Desktop:
- Chrome DevTools → Toggle Device Toolbar
- Lighthouse → PWA Audit

### Mobile:
- iOS: Safari Web Inspector
- Android: Chrome Remote Debugging

## ⚡ Performance

- Keine externen Abhängigkeiten
- Minimaler JavaScript-Code
- Effizientes Canvas-Rendering
- Intelligente Partikel-Limits

## 🔒 Sicherheit

- Kein Server-Code
- Keine Datensammlung
- Lokale Ausführung
- HTTPS required (automatisch bei GitHub Pages)

---

Erstellt mit ❤️ für digitale Achtsamkeit