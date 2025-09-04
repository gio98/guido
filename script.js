// Configurazione
const OLLAMA_HOST = 'https://unlikely-grand-prawn.ngrok-free.app'; // Rimosso lo slash finale per evitare doppio slash nell'URL
const MODEL_ID = 'gemma3:270m';

// Abilitazione del CORS proxy
const USE_CORS_PROXY = true;
const CORS_PROXY = 'https://corsproxy.io/?';

// Elementi DOM
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// Stato dell'applicazione
let isWaitingForResponse = false;

// Funzione per aggiungere un messaggio alla chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Funzione per gestire l'invio del messaggio
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isWaitingForResponse) return;

    // Aggiungi il messaggio dell'utente alla chat
    addMessage(message, true);
    chatInput.value = '';

    // Crea un elemento per la risposta del bot
    const botMessageDiv = document.createElement('div');
    botMessageDiv.classList.add('message', 'bot-message');
    chatMessages.appendChild(botMessageDiv);

    // Imposta lo stato di attesa
    isWaitingForResponse = true;
    sendButton.disabled = true;
    sendButton.innerHTML = '<span class="loading"></span>';

    // Prepara i dati per la richiesta
    const data = {
        model: MODEL_ID,
        prompt: message
    };

    // Costruisci l'URL dell'API
    const apiUrl = USE_CORS_PROXY ? `${CORS_PROXY}${OLLAMA_HOST}/api/generate` : `${OLLAMA_HOST}/api/generate`;
    
    // Utilizzo di XMLHttpRequest per evitare problemi CORS
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Gestione della risposta in streaming
    let botResponse = '';
    let buffer = '';
    
    xhr.onprogress = function() {
        // Aggiungi il nuovo testo al buffer
        const newText = xhr.responseText.substring(buffer.length);
        buffer = xhr.responseText;
        
        // Elabora le nuove righe
        const lines = newText.split('\n');
        for (const line of lines) {
            if (line.trim()) {
                try {
                    const jsonLine = JSON.parse(line);
                    const responseText = jsonLine.response || '';
                    botResponse += responseText;
                    botMessageDiv.textContent = botResponse;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } catch (e) {
                    // Ignora le righe che non sono JSON valido
                }
            }
        }
    };
    
    xhr.onerror = function() {
        botMessageDiv.textContent = 'Si è verificato un errore durante la connessione al server. Potrebbe essere un problema di CORS o di connessione. Verifica che il server sia raggiungibile.';
        botMessageDiv.classList.add('error-message');
        console.error('Errore di rete:', xhr.status, xhr.statusText);
        console.log('URL utilizzato:', apiUrl);
    };
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Se non c'è stata risposta, mostra un messaggio di errore
            if (!botResponse) {
                botMessageDiv.textContent = 'Non ho ricevuto una risposta valida. Riprova più tardi.';
            }
        } else {
            botMessageDiv.textContent = `Errore HTTP: ${xhr.status} ${xhr.statusText}`;
            botMessageDiv.classList.add('error-message');
            console.error('Errore HTTP:', xhr.status, xhr.statusText);
        }
        
        // Ripristina lo stato del pulsante
        isWaitingForResponse = false;
        sendButton.disabled = false;
        sendButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `;
    };
    
    // Invia la richiesta
    xhr.send(JSON.stringify(data));
}

// Event listeners per la chat
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});



// Messaggio di benvenuto
window.addEventListener('DOMContentLoaded', () => {
    addMessage('Ciao! Sono Guido il tuo assistente meccanico! PIT STOP!', false);
});



// Funzione per caricare e inviare immagini (opzionale, per futura implementazione)
async function sendImageMessage(imageFile) {
    if (!imageFile || isWaitingForResponse) return;
    
    // Mostra l'immagine nella chat
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.style.maxWidth = '100%';
        imgElement.style.borderRadius = '8px';
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        messageDiv.appendChild(imgElement);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    reader.readAsDataURL(imageFile);
    
    // Implementazione futura per l'invio di immagini al modello
    // Questa funzionalità richiederebbe la conversione dell'immagine in base64
    // e l'invio al server Ollama, simile a come viene fatto nel codice Python originale
}
