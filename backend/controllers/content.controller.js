import Content from '../db/models/Content.model.js';
import { mockData } from '../db/data.mock.js';

// --- Obtener contenido de una sección específica (ej: 'aboutUs') ---
export const getContentBySection = async (req, res, next) => {
    const { sectionName } = req.params;

    const ResponseAPI = {
        msg: "Contenido obtenido",
        data: null,
        status: 'ok'
    };

    try {
        let content;
        // Lógica especial para galerías que vienen de un mock diferente
        if (sectionName.toLowerCase().includes('gallery')) {
            const key = sectionName.split('-')[1]; // ej: 'gallery-graphicDesign' -> 'graphicDesign'
            content = mockData.galleryImages[key] || [];
        } else {
             content = await Content.findOne({ section: sectionName });
        }


        if (content) {
            ResponseAPI.data = content;
            res.status(200).json(ResponseAPI);
        } else {
            ResponseAPI.msg = `No se encontró contenido para la sección '${sectionName}'`;
            ResponseAPI.status = 'error';
            res.status(404).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};