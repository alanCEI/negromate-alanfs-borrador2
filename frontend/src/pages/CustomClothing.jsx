import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import '@/css/pages/CustomClothing.css';
import '@/css/pages/GraphicDesign.css'; // Reutilizamos los estilos de PriceCard

const PriceCard = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="price-card">
            <h3 className="price-card-name">{product.name}</h3>
            <p className="price-card-description">{product.description}</p>
            <div className="price-card-price">{product.price}€</div>
             <ul className="price-card-details">
                {product.details.map((detail, i) => <li key={i}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>{detail}</span></li>)}
            </ul>
            <button onClick={() => addToCart(product)} className="button">Agregar al Carrito</button>
        </div>
    );
}

const CustomClothing = () => {
    const [products, setProducts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const [productsRes, galleryRes] = await Promise.all([
                    api.products.get('CustomClothing', { signal: controller.signal }),
                    api.content.get('gallery-customClothing', { signal: controller.signal })
                ]);
                setProducts(productsRes.data);
                setGallery(galleryRes.data);
            } catch (error) {
                if(error.name !== 'AbortError') console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => controller.abort();
    }, []);

    if (loading) return <div className="loading-message">Cargando prendas...</div>;

    return (
        <div className="bg-main-color text-sub-color">
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Galería de Ropa Personalizada</h2>
                    <div className="clothing-gallery-grid">
                        {gallery.map(item => (
                            <div key={item.id} className="clothing-gallery-item" onClick={() => setModalImage(item.imageUrl)}>
                                <img src={item.imageUrl} alt={item.title} className="clothing-gallery-item-image" />
                                <div className="clothing-gallery-item-overlay">
                                    <h3 className="clothing-gallery-item-title">{item.title}</h3>
                                    <p className="clothing-gallery-item-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section price-card-section">
                <div className="container">
                    <h2 className="section-title">Paquetes de Personalización</h2>
                     <div className="price-cards-grid">
                       {products.map(p => <PriceCard key={p._id} product={p} />)}
                    </div>
                </div>
            </section>
            {modalImage && (
                <div className="modal-overlay" onClick={() => setModalImage(null)}>
                    <img src={modalImage} alt="Vista ampliada" className="modal-image" />
                </div>
            )}
        </div>
    );
};

export default CustomClothing;
