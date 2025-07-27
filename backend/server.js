require('dotenv').config(); // Lädt umgebungsvariable aus .env

const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); 

// Importiere das Post-Modell
const Post = require('./models/Post');

const app = express(); 
const PORT = process.env.PORT || 5000; // Port für den Server, Standard ist 5000
const MONGODB_URI = process.env.MONGODB_URI; // MONGODB URI aus .env

// Middleware
app.use(cors()); // Erlaubt Cross- Origin Anfragen vom Frontend
app.use(express.json()); // Erlaubt dem Server, JSON Daten im Request Body zu parsen 

// Datenbankverbindung
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB erfolgreich verbunden!'))
    .catch(err => console.error('MongoDB Verbindungsfehler:', err)); 

// Erste Route (Test Endpunkt)
app.get('/', (req, res) => {
    res.send('Willkommen zur Blog API!');
}); 

// API Endpunkte für Blog Beiträge
// Route 1: Alle Blog- Beiträge abrufen (READ all)
// GET /api/posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Alle Beitröge finden 
        res.json(posts); // und als JSON zurückgeben 
    } catch (err) {
        res.status(500).json({message: err.message }); // Fehler bei Serverantwort
    }
});

// Route 2: Einen neuen Blog- Beitrag erstellen (CREATE)
// POST /api/posts
app.post('/api/posts', async (req, res) => {
    const { title, content, author } = req.body; // Daten aus dem Request- Body extrahieren 

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

// Server starten 
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
