# Chat con Gemma3

Questo progetto è un'interfaccia chat responsiva lato client che consente di interagire con il modello Gemma3 tramite un'API Ollama.

## Caratteristiche

- Interfaccia chat moderna e responsiva
- Comunicazione in tempo reale con il modello Gemma3
- Gestione dello streaming delle risposte
- Supporto per dispositivi mobili e desktop
- Completamente lato client (JavaScript puro)
- Implementazione diretta con XMLHttpRequest per evitare problemi CORS

## Come utilizzare

1. Apri il file `index.html` nel tuo browser
2. Digita un messaggio nella casella di testo in basso
3. Premi il pulsante di invio o premi Enter per inviare il messaggio
4. Attendi la risposta dal modello Gemma3

## Configurazione

Per configurare l'applicazione, modifica le seguenti costanti nel file `script.js`:

- `OLLAMA_HOST`: L'URL del server Ollama (default: 'https://026d77ff356f.ngrok-free.app')
- `MODEL_ID`: L'ID del modello da utilizzare (default: 'gemma3:270m')

## Struttura del progetto

- `index.html`: La struttura HTML dell'applicazione
- `style.css`: Gli stili CSS per l'interfaccia utente
- `script.js`: La logica JavaScript per la comunicazione con l'API

## Note tecniche

L'applicazione utilizza le API JavaScript come:

- XMLHttpRequest per comunicare direttamente con il server Ollama, evitando problemi CORS
- Gestione degli eventi onprogress per lo streaming delle risposte
- JSON.parse per l'elaborazione delle risposte in formato JSON
- Gestione degli eventi per le operazioni asincrone

## Requisiti

- Un browser moderno che supporti le API JavaScript utilizzate
- Accesso all'host Ollama specificato nella configurazione