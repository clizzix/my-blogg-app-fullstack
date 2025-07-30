import React, { useState, useEffect } from 'react';

function PostForm({ post, onSuccess}) {
    const [title, setTitle] = useState(post ? post.title : ''); 
    const [content, setContent] = useState(post ? post.content : '');
    const [author, setAuthor] = useState(post ? post.author : ''); 
    const [message, setMessage] = useState(''); // Für Erfolgs- oder Fehlermeldung

    // useEffect, um den State zu aktualisieren, wenn sich der 'post'-Prop ändert
    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
            setAuthor(post.author || '');
        } else {
            // Felder leere, wenn kein Post zum Bearbeiten vorhanden ist
            setTitle('');
            setContent('');
            setAuthor('');
        }
        setMessage('');
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars

        // Einfache Validierung im Frontend
        if (!title.trim() || !content.trim()) {
            setMessage('Titel und Inhalt dürfen nicht leer sein.')
            return;
        }
        const postData = { title, content, author };
        let url = 'http://localhost:8080/api/posts';
        let method = 'POST';

        // Wenn ein 'post'-Objekt vorhanden ist, sind wir im Bearbeitungsmodus (PUT-Anfrage)
        if (post) {
            url = `http://localhost:8080/api/posts/${post._id}`;
            method = 'PUT'; 
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData), 
            });

            if (!response.ok) {
                // Wenn der Server einen Fehlerstatus (z.B. 400, 500) zurückgibt
                const errorData = await response.json();
                throw new Error(errorData.message || 'Fehler beim Speichern des Beitrags.');
            }

            const data = await response.json(); 
            console.log('Neuer Beitrag erstellt/ aktualisiert:', data);
            setMessage(`Beitrag erfolgreich ${post ? 'aktualisiert': 'erstellt'}!`);

            // Wenn ein Erfolg- Callback übergeben wurde, rufen wir ihn auf
            if (onSuccess) {
                onSuccess();
            }

            // Felder nach erfolgreichem Senden nur leeren, wenn es ein neuer Beitrag war
            if (!post) {
                setTitle('');
                setContent('');
                setAuthor('');
            }
            // Formularfelder nach erfolgreichem Senden zurücksetzen 

            // Optional: Backend- Logs im Terminal prüfen 
        } catch (error) {
            console.error('Fehler beim Erstellen des Beitrags:', error);
            setMessage(`Fehler: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{post ? 'Beitrag bearbeiten' : 'Neuen Blog-Beitrag erstellen'}</h2>
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
                    {post ? 'Änderungen speichern' : 'Beitrag erstellen'}
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
