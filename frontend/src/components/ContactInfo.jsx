import { Link } from 'react-router-dom';
import '@/css/components/ContactInfo.css';

const ContactInfo = () => {
    return (
        <section className="section contact-info-section">
            <div className="container">
                <h2 className="contact-info-title">¿Tienes un proyecto en mente?</h2>
                <p className="contact-info-text">
                    Nos encantaría escucharlo. Ponte en contacto con nosotros y hagamos que tu idea cobre vida.
                </p>
                <Link to="/contact" className="button">
                    Hablemos
                </Link>
            </div>
        </section>
    );
};

export default ContactInfo;
