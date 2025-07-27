import React, {useEffect, useState } from 'react'; 

function PostList() {
    // useState Hook: 'posts' speichert die Blog Beiträge, 'setPosts' aktualisiert sie
    const [posts, setPosts] = useState([]); 
    // useState Hook 'error' speichert Fehlermeldungen, falls die API- Anfrage fehlschlägt
    const [error, setError] = useState(null); 
    // useState Hook: 'loading' zeigt an, ob Daten geladen werden
    const [loading, setLoading] = useState(true); 

    // useEffect Hook: Führt Code einmal nach dem ersten Rendern der Komponente aus
    useEffect(() => {
        // Definieren der Funktion zum Abrufen der Beiträge
        const fetchPosts = async () => {
            try {
                // API- Anfrage an unser Backend
                const response = await fetch('http://localhost:8080/api/posts');

                // Überprüfung ob Antwort erfolgreich war
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Antwort in JSON umwandeln
                setPosts(data); // Blog Beiträge im State speichern
              } catch (e) {
                console.error("Fehler beim Abrufen der Beiträge:", e);
                setError("Fehler beim Laden der Blog-Beiträge. Bitte versuchen sie es später erneut"); 
              } finally {
                setLoading(false); //Ladezustand beenden
              }
        };

        fetchPosts(); // Rufen Sie die Funktion auf, um die Beiträge zu laden 
    }, []); // Das leere Array sorgt dafür, dass useEffect nur einmal ausgeführt wird

    // Ladezustand anzeigen 
    if (loading) {
        return <p>Beiträge werden geladen...</p>;
    }
    // Fehlerzustand anzeigen
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Aktuelle Blog-Beiträge</h2>
            {/* Prüfen, ob Beiträge vorhanden sind, bevor sie gerendert werden */}
            {posts.length === 0 ? (
                <p>Noch keine Blog-Einträge vorhanden.</p>
            ) : (
              <ul>
                {posts.map(post => (
                    <li key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>
                            <small>Autor: {post.author || 'Unbekannt'} | Erstellt am: {new Date(post.createdAt).toLocaleDateString()}</small>
                        </p>
                    </li>
                ))}
              </ul>  
            )}
        </div>
    );
}
export default PostList; // Exportieren der Komponente 