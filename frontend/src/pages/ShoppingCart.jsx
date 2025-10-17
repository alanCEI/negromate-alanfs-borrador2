import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@/css/pages/ShoppingCart.css';

const ShoppingCart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleCheckout = async () => {
        setStatus({ loading: true, error: null, success: false });
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error("Debes iniciar sesión para finalizar la compra.");
            }
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                }))
            };
            await api.orders.create(orderData, token);
            setStatus({ loading: false, error: null, success: true });
            setTimeout(clearCart, 300);
        } catch (error) {
            setStatus({ loading: false, error: error.message || 'Hubo un error al procesar tu orden.', success: false });
        }
    };

    if (status.success) {
        return (
             <div className="contact-success-message">
                <div className="contact-success-box">
                    <h1 className="text-3xl font-bold text-contrast-color mb-4">¡Orden Realizada con Éxito!</h1>
                    <p>Gracias por tu compra. Hemos recibido tu pedido.</p>
                    <Link to="/" className="button" style={{marginTop: '1.5rem', display: 'inline-block'}}>Volver al Inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <section className="section cart-page">
            <div className="container">
                <h1 className="section-title">Carrito de Compras</h1>
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <p>Tu carrito está vacío.</p>
                        <Link to="/" className="button">Explorar productos</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-container">
                            {cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-info">
                                        <img src={item.imageUrl} alt={item.name} className="cart-item-image"/>
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.price.toFixed(2)}€</p>
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                            className="cart-item-quantity"
                                            min="1"
                                        />
                                        <button onClick={() => removeFromCart(item._id)} className="cart-item-remove">
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                             <h2>Resumen de la Orden</h2>
                             <div className="cart-summary-row">
                                 <span>Subtotal</span>
                                 <span>{cartTotal.toFixed(2)}€</span>
                             </div>
                             <div className="cart-summary-total">
                                 <span>Total</span>
                                 <span>{cartTotal.toFixed(2)}€</span>
                             </div>
                             <button
                                onClick={handleCheckout}
                                disabled={status.loading}
                                className="button"
                             >
                                 {status.loading ? 'Procesando...' : 'Finalizar Compra'}
                             </button>
                             {status.error && <p className="error-message" style={{textAlign: 'center', marginTop: '1rem'}}>{status.error}</p>}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShoppingCart;
