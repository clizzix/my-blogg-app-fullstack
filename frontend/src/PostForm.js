import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';   

function PostForm({ post, onSuccess}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState(post ? post.title : ''); 
    const [content, setContent] = useState(post ? post.content : '');
    const [author, setAuthor] = useState(post ? post.author : ''); 
    const [message, setMessage] = useState(''); // Für Erfolgs- oder Fehlermeldung

    // useEffect, um den State zu aktualisieren, wenn sich der 'post'-Prop ändert
    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/posts/${id}`);
                    if (!response.ok) {
                        throw new Error('Beitrag zum Bearbeiten nicht gefunden.');
                    }
                    const postData = await response.json();
                    setTitle(postData.title || '');
                    setContent(postData.content || '');
                    setAuthor(postData.author || '');
                } catch (error) {
                    setMessage(`Fehler: ${error.message}`);
                }
            };
            fetchPost();
        } 
    }, [id]);

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
        if (id) {
            url = `http://localhost:8080/api/posts/${id}`;
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
            setMessage(`Beitrag erfolgreich ${id ? 'aktualisiert': 'erstellt'}!`);

            if (id) {
                navigate(`/posts/${data._id}`);
            } else {
                setTitle('');
                setContent('');
                setAuthor('');
            }
        } catch (error) {
            console.error('Fehler beim Erstellen des Beitrags:', error);
            setMessage(`Fehler: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{id ? 'Beitrag bearbeiten' : 'Neuen Blog-Beitrag erstellen'}</h2>
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
                    {id ? 'Änderungen speichern' : 'Beitrag erstellen'}
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
