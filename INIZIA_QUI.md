
La cartella **`movieverse-final`** contiene tutto il necessario per far funzionare il sito.

---

## 📦 Cosa Contiene

### ✨ Applicazione Completa
- **Frontend React** con Vite
- **Backend Node.js** con Express
- **Database SQLite** (si crea automaticamente)
- **Autenticazione JWT** con password criptate
- **Integrazione OMDb API**

### 🎨 Design Premium
- Font: **Outfit** (titoli) + **Poppins** (testo)
- Animazioni avanzate (pulse, slide, fade, glow)
- Glassmorphism e backdrop-filter
- Gradienti animati
- Effetti hover 3D
- Completamente responsive

### 📁 File Importanti
- `AVVIA.bat` → **DOPPIO CLICK PER AVVIARE TUTTO!**
- `README.md` → Istruzioni complete
- `DEPLOY.md` → Guida per mettere online
- `CHECKLIST.md` → Verifica installazione

---

## 🚀 COME AVVIARE (3 MODI)

### Metodo 1: AUTOMATICO (CONSIGLIATO) ⚡
1. Vai nella cartella `movieverse-final`
2. **Doppio click** su `AVVIA.bat`
3. Aspetta che si aprano 2 finestre
4. Apri `http://localhost:5173` nel browser
5. **FATTO!** 🎉

### Metodo 2: Manuale (2 Terminali)
**Terminale 1:**
```powershell
cd movieverse-final/server
npm start
```

**Terminale 2:**
```powershell
cd movieverse-final
npm run dev
```

### Metodo 3: Visual Studio Code
1. Apri la cartella `movieverse-final` in VS Code
2. Apri il terminale integrato (Ctrl + `)
3. Digita: `cd server && npm start`
4. Apri un nuovo terminale (icona +)
5. Digita: `npm run dev`

---

## 🌐 METTERE ONLINE (ZERO CODICE)

### Passo 1: GitHub Desktop
1. Scarica: https://desktop.github.com/
2. File → Add Local Repository
3. Seleziona `movieverse-final`
4. Publish repository

### Passo 2: Vercel
1. Vai su: https://vercel.com
2. Sign up con GitHub
3. Import Project → `movieverse-final`
4. Aggiungi variabili:
   - `VITE_OMDB_API_KEY` = `658696de`
   - `JWT_SECRET` = `movie_app_secret_key_2025`
5. Deploy!

**Il sito sarà online in 2 minuti!** 🚀

---

## 📊 Statistiche Progetto

- **Linee di codice CSS**: 1000+
- **Componenti React**: 3 (Auth, MovieCard, MovieModal)
- **Endpoint API**: 5 (register, login, get/add/remove collection)
- **Animazioni CSS**: 8 (pulse, slideUp, fadeIn, shake, ecc.)
- **Font caricati**: 2 (Outfit, Poppins)
- **Responsive breakpoints**: 2 (768px, 480px)

---

## 🎯 Funzionalità Complete

### Autenticazione
- ✅ Registrazione con username, email, password
- ✅ Login con email e password
- ✅ Password criptate con bcrypt
- ✅ Token JWT per sessioni
- ✅ Logout

### Film
- ✅ Ricerca film e serie TV
- ✅ Dettagli completi (trama, cast, rating)
- ✅ Poster ad alta qualità
- ✅ Modal con informazioni estese

### Collezione
- ✅ Aggiungi film alla collezione
- ✅ Rimuovi film dalla collezione
- ✅ Collezione persistente (database)
- ✅ Collezione personale per utente

### Interfaccia
- ✅ Home page con descrizione
- ✅ Navigazione a tab
- ✅ Film di tendenza
- ✅ Design premium
- ✅ Animazioni fluide
- ✅ Responsive mobile

---

## 🛠️ Tecnologie Utilizzate

### Frontend
- React 19
- Vite 5
- Vanilla CSS (no framework!)
- Google Fonts (Outfit, Poppins)

### Backend
- Node.js
- Express
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs

### API
- OMDb API (film database)

---

## 📝 Note Importanti

### Database
Il database SQLite (`database.db`) viene creato automaticamente al primo avvio del server nella cartella `server/`.

### API Key
La chiave OMDb (`658696de`) è già configurata nel file `.env`.

### Porte
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

---

## 🆘 Supporto

Se hai problemi:
1. Leggi `CHECKLIST.md` per verificare l'installazione
2. Leggi `README.md` per le istruzioni dettagliate
3. Controlla che Node.js sia installato (`node --version`)


