import React, {useEffect, useState } from 'react'; 
import PostForm from './PostForm.js';

function PostList() {
    // useState Hook: 'posts' speichert die Blog Beiträge, 'setPosts' aktualisiert sie
    const [posts, setPosts] = useState([]); 
    // useState Hook 'error' speichert Fehlermeldungen, falls die API- Anfrage fehlschlägt
    const [error, setError] = useState(null); 
    // useState Hook: 'loading' zeigt an, ob Daten geladen werden
    const [loading, setLoading] = useState(true); 
    const [message, setMessage] = useState(''); // Für Erfolgs- oder Fehlermeldungen 
    const [editingPost, setEditingPost] = useState(null); 

   
    
        // Definieren der Funktion zum Abrufen der Beiträge
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            // API- Anfrage an unser Backend
            const response = await fetch('http://localhost:8080/api/posts');

            // Überprüfung ob Antwort erfolgreich war
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Netzwerkantwort war nicht ok.');
            }
            const data = await response.json(); // Antwort in JSON umwandeln
            setPosts(data); // Blog Beiträge im State speichern
            } catch (err) {
                console.error("Fehler beim Abrufen der Beiträge:", err);
                setError(`Fehler beim Laden der Blog-Beiträge: ${err.message}`); 
            } finally {
                setLoading(false); //Ladezustand beenden
            }
    };
    // Beiträge beim ersten Rendern laden
    useEffect(() => {
        fetchPosts(); // Rufen Sie die Funktion auf, um die Beiträge zu laden 
    }, []); // Das leere Array sorgt dafür, dass useEffect nur einmal ausgeführt wird

    // Funktion zum Löschen eines Beitrags
    const handleDelete = async (id) => {
        if (window.confirm('Möchtest du diesen Beitrag wirklich löschen?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(errorData.message || 'Fehler beim Löschen des Beitrags');
                }

                setMessage('Beitrag erfolgreich gelöscht');
                fetchPosts(); // Beiträge neu laden um den gelöschten Beitrag zu entfernen 
                setEditingPost(null); // Bearbeitungsmodus beenden, falls dieser Post bearbeitet wurde
            } catch (error) {
                console.error('Fehler beim Löschen des Beitrags:', error);
                setMessage(`Fehler beim Löschen: ${error.message}`);
            }
        }
    };

    // Funktion zum Bearbeiten eines Betrags 
    const handleEdit = (post) => {
        setEditingPost(post);
        setMessage('');
    };

    // Callback Funktion, die aufgerufen wird, wenn das Formular erfolgreich gesendet wurde
    const handlePostFormSuccess = () => {
        fetchPosts(); // Beiträge neu laden, um aktualisierte Liste anzuzeigen
        setEditingPost(null); // Bearbeitungsmodus beenden
        setMessage('Aktion erfolgreich abgeschlossen!'); // Allgemeine Erfolgsmeldung
    };

    if (loading) return <p>Beiträge werden geladen...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (posts.length === 0 && !editingPost) return <p>Noch keine Blog-Beiträge vorhanden</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto'}}>
            <h2>Aktuelle Blog-Beiträge</h2>
            {message && (
                <p style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', backgroundColor: message.startsWith('Fehler:') ? '#ffdddd': '#ddffdd', border: `1px solid ${message.startsWith('Fehler:') ? '#ffaaaa' : '#aaffaa'}`
                }}>
                    {message}
                </p>
            )}

            {editingPost && (
                <div style={{ marginBottom: '30px' }}>
                    <PostForm post={editingPost} onSuccess={handlePostFormSuccess} />
                    <button
                        onClick={() => setEditingPost(null)}
                        style={{ padding: '8px 12px', marginTop: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                        Bearbeitung abbrechen
                    </button>
                </div>
            )}
            
            {posts.map(post => (
                <div key={post._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ marginBottom: '5px' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                        Autor: {post.author || 'Unbekannt'} | Erstellt: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p>{post.content}</p>
                    <div style={{ narginTop: '10px' }}>
                        <button
                            onClick={() => handleEdit(post)}
                            style={{ padding: '8px 12px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Bearbeiten
                        </button>
                        <button
                            onClick={() => handleDelete(post._id)}
                            style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Löschen
                        </button> 
                    </div>        
                </div>
            ))}
        </div>
    );

}
export default PostList; // Exportieren der Komponente 