const mongoose = require('mongoose'); 
// Das Schema definiert die Struktur des Blog- Beitrags
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // titel ist ein Pflichtfeld
        trim: true // Leerzeichen am Anfang und Ende entfernen
    },
    content: {
        type: String,
        required: true
    },
    author : {
        type: String, 
        default: 'Anonymous' // Standardwert, falls kein Autor angegeben wird
    },
    createdAt: {
        type: Date,
        default: Date.now // Datum wird automatisch beim Erstellen gesetzt
    }
}); 

// Erstelle das Modell aus dem Schema 
const Post = mongoose.model('Post', postSchema); 

module.exports = Post; // Exportiere das Modell, damit wir es in anderen Dateien nutzen können 