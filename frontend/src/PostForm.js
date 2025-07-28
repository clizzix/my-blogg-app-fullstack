import React, { useState } from 'react';

function PostForm() {
    const [title, setTitle] = useState(''); 
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(''); 
    const [message, setMessage] = useState(''); // Für Erfolgs- oder Fehlermeldung

    const handleSubmit = async (e) => {
        e.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars

        // Einfache Validierung im Frontend
        if (!title.trim() || !content.trim()) {
            setMessage('Titel und Inhalt dürfen nicht leer sein.')
            return;
        }

        const newPost = { title, content, author };

        try {
            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost), 
            });

            if (!response.ok) {
                // Wenn der Server einen Fehlerstatus (z.B. 400, 500) zurückgibt
                const errorData = await response.json();
                throw new Error(errorData.message || 'Fehler beim Erstellen des Beitrags.');
            }

            const data = await response.json(); 
            console.log('Neuer Beitrag erstellt', data);
            setMessage('Beitrag erfolgreich erstellt!')
            // Formularfelder nach erfolgreichem Senden zurücksetzen 
            setTitle('');
            setContent('');
            setAuthor('');
            // Optional: Backend- Logs im Terminal prüfen 
        } catch (error) {
            console.error('Fehler beim Erstellen des Beitrags:', error);
            setMessage(`Fehler: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Neuen Blog-Beitrag erstellen</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Titel:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '5px'}}>Inhalt:</label>
                    <textarea 
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="6"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        ></textarea>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="author" style={{ display: 'block', marginBottom: '5px' }}>Autor (optional):</label>
                    <input 
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                    Beitrag erstellen
                </button>
            </form>
            {message && (
                <p style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', backgroundColor: message.startsWith('Fehler:') ? '#ffdddd' : 'ddffdd', border: `1px solid ${message.startsWith('Fehler') ? '#ffaaaa' : '#aaffaa'}`}}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default PostForm;
