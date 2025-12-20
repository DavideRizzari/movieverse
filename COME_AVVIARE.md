# Come Avviare MovieVerse

## Metodo Semplice (Raccomandato)

1. **Doppio click su `AVVIA.bat`** nella cartella principale
   - Questo avvierà automaticamente sia il backend che il frontend
   - Aspetta che si aprano 2 finestre del terminale
   - Il browser si aprirà automaticamente su http://localhost:5173

## Metodo Manuale

Se AVVIA.bat non funziona, segui questi passaggi:

### 1. Avvia il Backend
```bash
cd server
npm start
```

### 2. Avvia il Frontend (in una nuova finestra del terminale)
```bash
npm run dev
```

### 3. Apri il Browser
Vai su: http://localhost:5173

## IMPORTANTE

❌ **NON aprire dist/index.html direttamente nel browser**
✅ **USA sempre il server di sviluppo (npm run dev o AVVIA.bat)**

## Problemi Comuni

### Il sito è vuoto o non si carica
- Assicurati che ENTRAMBI i server (backend e frontend) siano in esecuzione
- Backend deve essere su porta 3001
- Frontend deve essere su porta 5173

### "Cannot connect to server"
- Verifica che il backend sia avviato (`cd server && npm start`)
- Controlla che non ci siano errori nel terminale del backend
