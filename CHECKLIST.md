# ✅ CHECKLIST - Verifica Installazione

## File Essenziali

### Frontend (Cartella Principale)
- [x] package.json
- [x] vite.config.js
- [x] index.html
- [x] .env (con VITE_OMDB_API_KEY)
- [x] vercel.json
- [x] .gitignore

### Backend (Cartella server/)
- [x] server/index.js
- [x] server/database.js
- [x] server/package.json
- [x] server/.env (con JWT_SECRET)

### Componenti React (src/)
- [x] src/App.jsx
- [x] src/index.css
- [x] src/main.jsx
- [x] src/components/Auth.jsx
- [x] src/components/MovieCard.jsx
- [x] src/components/MovieModal.jsx
- [x] src/services/api.js
- [x] src/services/omdb.js

### Documentazione
- [x] README.md
- [x] DEPLOY.md
- [x] AVVIA.bat (script Windows)

---

## Come Verificare

### 1. Verifica Node.js
Apri PowerShell e digita:
```powershell
node --version
```
Dovresti vedere: `v21.6.1` o superiore

### 2. Verifica Dipendenze Frontend
```powershell
npm list react
```
Dovresti vedere: `react@19.2.0`

### 3. Verifica Dipendenze Backend
```powershell
cd server
npm list express
```
Dovresti vedere: `express@4.x.x`

---

## Test Rapido

### Opzione 1: Script Automatico (PIÙ FACILE)
Doppio click su `AVVIA.bat`

### Opzione 2: Manuale
**Terminale 1:**
```powershell
cd server
npm start
```

**Terminale 2:**
```powershell
npm run dev
```

---

## Cosa Aspettarsi

### Backend (Terminale 1)
```
Connected to SQLite database
Server running on http://localhost:3001
```

### Frontend (Terminale 2)
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Tutto OK?

Se vedi entrambi i messaggi sopra, **TUTTO FUNZIONA!**

Apri `http://localhost:5173` nel browser e goditi MovieVerse! 🎉

---

## ❌ Problemi?

### "npm: command not found"
Node.js non è installato. Scaricalo da: https://nodejs.org

### "Cannot find module"
Reinstalla le dipendenze:
```powershell
npm install
cd server
npm install
```

### "Port 3001 already in use"
Un altro processo sta usando la porta. Chiudi tutti i terminali e riprova.

### "ENOENT: no such file or directory"
Sei nella cartella sbagliata. Assicurati di essere in `movieverse-final/`
