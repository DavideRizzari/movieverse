# 🎬 MovieVerse - Istruzioni Complete

## 📁 Questa è la cartella FINALE e PULITA del progetto!

Tutti i file sono pronti e configurati correttamente.

---

## 🚀 AVVIO RAPIDO (2 Passi)

### Passo 1: Avvia il Backend (Server)

Apri un terminale PowerShell in questa cartella e digita:

```powershell
cd server
npm start
```

**Vedrai:** `Server running on http://localhost:3001`

⚠️ **IMPORTANTE**: Lascia questo terminale APERTO!

---

### Passo 2: Avvia il Frontend (Sito)

Apri un **SECONDO** terminale PowerShell (lascia il primo aperto) e digita:

```powershell
npm run dev
```

**Vedrai:** Un link tipo `http://localhost:5173`

Apri quel link nel browser! 🎉

---

## 📂 Struttura Progetto

```
movieverse-final/
├── server/              ← Backend (Node.js + Express + SQLite)
│   ├── index.js        ← API REST
│   ├── database.js     ← Configurazione database
│   ├── .env            ← Variabili d'ambiente
│   └── package.json    ← Dipendenze server
│
├── src/                ← Frontend (React + Vite)
│   ├── components/     ← Componenti React
│   │   ├── Auth.jsx           ← Login/Registrazione
│   │   ├── MovieCard.jsx      ← Card film
│   │   └── MovieModal.jsx     ← Popup dettagli
│   ├── services/       ← Client API
│   │   ├── api.js      ← Comunicazione backend
│   │   └── omdb.js     ← Comunicazione OMDb
│   ├── App.jsx         ← Componente principale
│   └── index.css       ← Stili (1000+ righe!)
│
├── .env                ← API Key OMDb
├── vercel.json         ← Configurazione deploy
├── package.json        ← Dipendenze frontend
└── README.md           ← Questo file
```

---

## ✨ Funzionalità

- ✅ **Autenticazione**: Login e registrazione con database
- 🔍 **Ricerca**: Cerca film e serie TV
- 📚 **Collezione**: Salva i tuoi preferiti
- ⭐ **Trending**: Scopri film popolari
- 📖 **Dettagli**: Modal con trama, cast, rating
- 🎨 **Design Premium**: Font Outfit + Poppins, animazioni, glassmorphism

---

## 🌐 Mettere Online (SENZA TERMINALE)

### Metodo 1: GitHub Desktop + Vercel (CONSIGLIATO)

1. **Scarica GitHub Desktop**: https://desktop.github.com/
2. **Apri GitHub Desktop** → File → Add Local Repository
3. **Seleziona** questa cartella `movieverse-final`
4. **Publish repository** (deseleziona "Keep private" se vuoi)
5. **Vai su Vercel**: https://vercel.com
6. **Sign up** con GitHub
7. **Import Project** → Seleziona `movieverse-final`
8. **Aggiungi variabili d'ambiente**:
   - `VITE_OMDB_API_KEY` = `658696de`
   - `JWT_SECRET` = `movie_app_secret_key_2025`
9. **Deploy!**

Il sito sarà online in 2 minuti! 🚀

---

## 🎨 Design Features

- **Font Premium**: Outfit (titoli) + Poppins (testo)
- **Animazioni**: Pulse, slide, fade, shake, gradient shift
- **Glassmorphism**: Effetti vetro smerigliato
- **Glow Effects**: Ombre luminose rosse
- **Background Animato**: Gradienti radiali pulsanti
- **Responsive**: Ottimizzato per mobile e tablet

---

## 🔧 Risoluzione Problemi

### Il server non parte?
```powershell
cd server
npm install
npm start
```

### Il frontend non parte?
```powershell
npm install
npm run dev
```

### Errore "ENOENT" o "Cannot find module"?
Reinstalla le dipendenze:
```powershell
# Frontend
npm install

# Backend
cd server
npm install
```

---

## 📞 Supporto

Se hai problemi, controlla:
1. Hai Node.js installato? (Versione 20+)
2. Hai aperto DUE terminali separati?
3. Il primo terminale è nella cartella `server`?
4. Il secondo terminale è nella cartella principale?

---

## 🎉 Buon Divertimento!

Goditi il tuo MovieVerse! 🍿🎬
