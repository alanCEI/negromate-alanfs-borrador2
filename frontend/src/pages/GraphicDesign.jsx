import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import '@/css/pages/GraphicDesign.css';

const PriceCard = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="price-card">
            <h3 className="price-card-name">{product.name}</h3>
            <p className="price-card-description">{product.description}</p>
            <div className="price-card-price">{product.price}€</div>
            <ul className="price-card-details">
                {product.details.map((detail, i) => (
                    <li key={i}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{detail}</span>
                    </li>
                ))}
            </ul>
            <button onClick={() => addToCart(product)} className="button">
                Agregar al Carrito
            </button>
        </div>
    );
};

const GalleryItem = ({ item, onSelect, isSelected }) => (
    <div
        onClick={onSelect}
        className={`gallery-item ${isSelected ? 'selected' : ''}`}
    >
        <h4 className="gallery-item-brand">{item.brand}</h4>
    </div>
);

const GraphicDesign = () => {
    const [products, setProducts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const [productsRes, galleryRes] = await Promise.all([
                    api.products.get('GraphicDesign', { signal: controller.signal }),
                    api.content.get('gallery-graphicDesign', { signal: controller.signal })
                ]);
                setProducts(productsRes.data);
                setGallery(galleryRes.data);
                if(galleryRes.data.length > 0) {
                    setSelectedItem(galleryRes.data[0]);
                }
            } catch (error) {
                 if (error.name !== 'AbortError') console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => controller.abort();
    }, []);

    if (loading) return <div className="loading-message">Cargando diseños...</div>;

    return (
        <div className="bg-main-color text-sub-color">
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Galería de Diseño Gráfico</h2>
                    <div className="gallery-layout">
                        <div className="gallery-sidebar">
                            {gallery.map(item => <GalleryItem key={item.id} item={item} onSelect={() => setSelectedItem(item)} isSelected={selectedItem?.id === item.id}/>)}
                        </div>
                        <div className="md-col-span-2">
                             {selectedItem && (
                                 <div className="gallery-main">
                                     <img src={selectedItem.imageUrl} alt={selectedItem.brand} className="gallery-main-image"/>
                                     <h3 className="gallery-main-brand">{selectedItem.brand}</h3>
                                     <p>{selectedItem.description}</p>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="section price-card-section">
                <div className="container">
                    <h2 className="section-title">Paquetes de Precios</h2>
                    <div className="price-cards-grid">
                       {products.map(p => <PriceCard key={p._id} product={p} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GraphicDesign;
