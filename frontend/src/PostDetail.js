import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '20px', }}>
                Autor: {post.author || 'Unbekannt'} | Erstellt: {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{post.content}</div>
            <div style={{ marginTop: '20px' }}>
                <Link to="/" style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px', marginRight: '10px' }}>
                Zurück zur Startseite
                </Link>
                <Link to={`/posts/edit/${post._id}`} style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Beitrag bearbeiten
                </Link>
            </div>
        </div>
    );
}

export default PostDetail;