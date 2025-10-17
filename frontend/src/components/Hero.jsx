import { useState, useEffect } from 'react';
import '@/css/components/Hero.css';

const Hero = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <section
            className="hero-section"
            style={{ backgroundImage: `url(/images/bghero-clear.webp)` }}
        >
            <div className="hero-overlay"></div>
            <div className={`hero-logo-container ${scrolled ? 'scrolled' : ''}`}>
                <img
                    src='/images/logoclear.webp'
                    alt="Negromate Creatives Logo"
                    className="hero-logo"
                />
            </div>
        </section>
    );
};

export default Hero;
