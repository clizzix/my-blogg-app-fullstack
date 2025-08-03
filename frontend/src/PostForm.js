import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';   

function PostForm({ post, onSuccess}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState(post ? post.title : ''); 
    const [content, setContent] = useState(post ? post.content : '');
    const [author, setAuthor] = useState(post ? post.author : ''); 
    const [message, setMessage] = useState(''); // Für Erfolgs- oder Fehlermeldung
    const [errors, setErrors] = useState({}); // State für Fehlerobjekte

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

        // 1. Lokale Validierung durchführen
        const newErrors = {};
        // Einfache Validierung im Frontend
        if (!title.trim()) {
            newErrors.title = 'Ein Titel ist erforderlich.';
        }
        if (!content.trim()) {
            newErrors.content = 'Inhalt ist erforderlich.';
        }
        setErrors(newErrors);

        // Wenn Fehler vorhanden sind, das Absenden stoppen 
        if (Object.keys(newErrors).length > 0) {
            setMessage('Bitte fülle alle Pflichtfelder aus.');
            return;
        }
        // Wenn keine Fehler vorhanden sind fortfahren
        const postData = { title, content, author };
        let url = 'http://localhost:8080/api/posts';
        let method = 'POST';

        if (id) {
            url = `http://localhost:8080/api/posts/${id}`;
            method = 'PUT'; 
        }
        // Wenn ein 'post'-Objekt vorhanden ist, sind wir im Bearbeitungsmodus (PUT-Anfrage)
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
    <div className="form-container">
        <h2>{id ? 'Beitrag bearbeiten' : 'Neuen Blog-Beitrag erstellen'}</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Titel:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                {errors.title && <p className="alert-danger" style={{ marginTop: '5px', padding: '5px' }}>{errors.title}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="content">Inhalt:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows="6"
                ></textarea>
                {errors.content && <p className="alert-danger" style={{ marginTop: '5px', padding: '5px' }}>{errors.content}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="author">Autor (optional):</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {id ? 'Änderungen speichern' : 'Beitrag erstellen'}
            </button>
        </form>
        {message && (
            <p className={message.startsWith('Fehler:') ? 'alert-danger' : 'alert-success'}>
                {message}
            </p>
        )}
    </div>
);

}

export default PostForm;
