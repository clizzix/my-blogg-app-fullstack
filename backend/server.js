require('dotenv').config(); // Lädt umgebungsvariable aus .env

const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); 

// Importiere das Post-Modell (NUR EINMAL)
const Post = require('./models/Post');

const app = express(); 
const PORT = process.env.PORT || 8080; // Port für den Server, Standard ist 5000
const MONGODB_URI = process.env.MONGODB_URI; // MONGODB URI aus .env
console.log('1. Server Start: MONGODB_URI (aus .env):', MONGODB_URI); 

// Middleware
console.log('2. Middleware: app.use(cors(()) wird angewendet.');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Erlaubt Cross-Origin Anfragen vom Frontend
console.log('3. Middleware app.use(express.json(()) wird angewendet.');
app.use(express.json()); // Erlaubt dem Server, JSON Daten im Request Body zu parsen 

// Datenbankverbindung
console.log('4. Datenbankverbindung: Verbindungsversuch zu MongoDB...')
mongoose.connect(MONGODB_URI) // <-- Korrigiert: MONGODB_URI verwenden
    .then(() => console.log('5. Datenbankverbindung: MongoDB erfolgreich verbunden!'))
    .catch(err => console.error('5. Datenbankverbindung: MongoDB Verbindungsfehler:', err)); 
// Routen Definitionen
console.log('6. Routen: Definitionen beginnen...');
// Erste Route (Test Endpunkt)
app.get('/', (req, res) => {
    console.log('7. Route-Root: Anfrage an / erhalten.');
    res.send('Willkommen zur Blog API!');
}); 

// API Endpunkte für Blog Beiträge
// Route 1: Alle Blog- Beiträge abrufen (READ all)
// GET /api/posts
app.get('/api/posts', async (req, res) => {
    console.log('8. Route-API: Anfrage an /api/posts erhalten.');
    try {
        const posts = await Post.find(); // Alle Beiträge finden
        console.log('9. Route-API: Posts aus Datenbank abgerufen:', posts.length); 
        res.json(posts); // und als JSON zurückgeben 
    } catch (err) {
        console.error('10. Route-API: Fehler in /api/posts:', err.message)
        res.status(500).json({message: err.message }); // Fehler bei Serverantwort
    }
});

// Route 2: Einen neuen Blog- Beitrag erstellen (CREATE)
// POST /api/posts
app.post('/api/posts', async (req, res) => {
    const { title, content, author } = req.body; // <-- Korrigiert: Destrukturierung

    // Einfache Validierung
    if (!title || !content) {
        return res.status(400).json({ message: 'Titel und Inhalt sind Pflichtfelder.' });
    }

    const newPost = new Post({
        title,
        content,
        author // Wenn author undefined ist wird der Default Wert aus dem Schema verwendet
    });

    try {
        const savedPost = await newPost.save(); // Beitrag in der Datenbank speichern
        res.status(201).json(savedPost); // Gespeicherten Beitrag zurücksenden mit Status 201 (created)
    } catch (err) {
        res.status(400).json({ message: err.message }); // Fehler bei Validierung 
    }
});

// Route 3: Einen Blog-Beitrag nach ID aktualisieren (UPDATE)
// PUT /api/posts/:id
app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params; // ID aus den URL-Parametern
    const {title, content, author } = req.body; // Aktualisiere die Daten aus dem Request Body

    console.log(`Anfrage zum Aktualisieren von Post ID: ${id} erhalten.`);

    // Einfache Validierung
    if (!title || !content) {
        return res.status(400).json({ message: 'Titel und Inhalt sind Pflichtfelder'}); 
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true, runValidators: true} // new: true gibt das aktualisierte Dokument zurück; runValidators: true führt Schema- Validatoren aus
        );

        if (!updatedPost) {
            console.log(`Post mit ID ${id} nicht gefunden.`);
            return res.status(404).json({ message: 'Blog-Beitrag nicht gefunden'});
        }

        console.log('Post erfolgreich aktualisiert:', updatedPost._id);
        res.json(updatedPost); // Den aktualisierten Beitrag zurückgeben 
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Beitrags:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// Route 4: Einen Blog-Beitrag nach ID löschen (DELETE)
// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params; // ID aus den URL-Parametern 

    console.log(`Anfrage zum Löschen von Post ID: ${id} erhalten.`);

    try {
        const deletedPost = await Post.findByIdAndDelete(id); 

        if (!deletedPost) {
            console.log(`Post mit ID ${id} nicht gefunden.`); 
            return res.status(400).json({ message: 'Blog- Beitrag nicht gefunden.' }); 
        }

        console.log('Post erfolgreich gelöscht:', deletedPost._id);
        res.json({ message: 'Blog-Beitrag erfolgreich gelöscht.' }); // Bestätigungsnachricht zurückgeben
    } catch (err) {
        console.error('Fehler beim Löschen des Beitrags:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Server starten
console.log('11. Server-Setup abgeschlossen: Versuche zu lauschen...');
app.listen(PORT, () => {
    // ACHTUNG: Hier MÜSSEN BACKTICKS (`) verwendet werden, NICHT ANFÜHRUNGSZEICHEN (' oder ")
    console.log(`12. Server Listen: Server läuft auf Port ${PORT}`);
});