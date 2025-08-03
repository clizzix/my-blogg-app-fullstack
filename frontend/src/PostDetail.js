import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';


function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (window.confirm('Möchtest du diesen Beitrag wirklich löschen?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Fehler beim Löschen des Beitrags.');
                }

                // Bei Erfolg zur Startseite navigieren
                navigate('/');
            } catch (error) {
                console.error('Fehler beim Löschen des Beitrags:', error);
            }
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Beitrag konnte nicht geladen werden.');
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError(`Fehler: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Beitrag wird geladen...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Beitrag nicht gefunden.</p>;


return (
    <div className="form-container">
        <h1>{post.title}</h1>
        <p className="post-meta">
            Autor: {post.author || 'Unbekannt'} | Erstellt: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginTop: '20px' }}>{post.content}</div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn btn-secondary">
                Zurück zur Startseite
            </Link>
            <Link to={`/posts/edit/${post._id}`} className="btn btn-primary">
                Beitrag bearbeiten
            </Link>
            <button
                onClick={handleDelete}
                className="btn btn-danger"
            >
                Beitrag löschen
            </button>
        </div>
    </div>
);
}

export default PostDetail;