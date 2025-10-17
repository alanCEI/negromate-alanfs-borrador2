import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import '@/css/pages/AboutUs.css';

const AboutUs = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const fetchContent = async () => {
            try {
                const response = await api.content.get('aboutUs', { signal: controller.signal });
                setContent(response.data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('No se pudo cargar el contenido. Inténtalo más tarde.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        return () => controller.abort();
    }, []);

    if (loading) return <div className="loading-message">Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!content) return <div className="loading-message">No hay contenido disponible.</div>;

    return (
        <section className="section">
            <div className="container">
                <h1 className="section-title">{content.title}</h1>
                <p
                    className="about-us-main-paragraph"
                    dangerouslySetInnerHTML={{ __html: content.mainParagraph }}
                ></p>

                <div className="about-us-content">
                    <figure className="artist-figure">
                        <img src={content.artists.imageUrl} alt={content.artists.title} className="artist-image" />
                        <figcaption className="artist-figcaption">
                            <a href={content.artists.instagram.adriana} target="_blank" rel="noopener noreferrer">@adriluzzatto</a>
                            <a href={content.artists.instagram.yoel} target="_blank" rel="noopener noreferrer">@soyyowyow</a>
                        </figcaption>
                    </figure>
                    <div className="artist-info">
                         <h2 className="artist-info-title">{content.artists.title}</h2>
                        {content.artists.paragraphs.map((p, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: p }}></p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
