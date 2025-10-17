import { Link } from 'react-router-dom';
import '@/css/components/Products.css';

const productCategories = [
    { title: 'Diseño Gráfico', path: '/graphic-design', image: '/images/ivy-bg.webp' },
    { title: 'Ropa Personalizada', path: '/custom-clothing', image: '/images/clothes.webp' },
    { title: 'Murales', path: '/murals', image: '/images/goiko.webp' }
];

const Products = () => {
    return (
        <section className="section products-section">
            <div className="container">
                <h2 className="section-title">Nuestros Servicios</h2>
                <div className="products-grid">
                    {productCategories.map((category) => (
                        <Link to={category.path} key={category.title} className="category-card">
                            <img src={category.image} alt={category.title} className="category-card-image" />
                            <div className="category-card-overlay">
                                <h3 className="category-card-title">{category.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
