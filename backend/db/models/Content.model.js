import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true, // Solo puede haber un documento por sección (ej. 'aboutUs')
    },
    title: {
        type: String,
        required: true,
    },
    mainParagraph: {
        type: String
    },
    // Estructura flexible para diferentes tipos de contenido
    artists: {
        title: String,
        imageUrl: String,
        instagram: {
            adriana: String,
            yoel: String
        },
        paragraphs: [String]
    },
    galleryImages: {
        type: Map,
        of: [{
            id: Number,
            title: String,
            brand: String,
            imageUrl: String,
            description: String
        }]
    }
}, {
    // Permite campos no definidos en el esquema
    strict: false
});

const Content = mongoose.model('Content', contentSchema);

export default Content;