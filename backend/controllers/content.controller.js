import Content from '../db/models/Content.model.js';
import { mockData } from '../db/data.mock.js';

// --- Obtener todo el contenido (Solo Admin) ---
export const getAllContent = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Contenido obtenido",
        data: [],
        status: 'ok'
    };

    try {
        const content = await Content.find({});
        ResponseAPI.data = content;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


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


// --- Crear nuevo contenido (Solo Admin) ---
export const createContent = async (req, res, next) => {
    const { section, title, body } = req.body;

    const ResponseAPI = {
        msg: "Contenido creado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        if (!section) {
            ResponseAPI.msg = "El campo 'section' es obligatorio";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Verificar que no exista contenido para esa sección
        const existingContent = await Content.findOne({ section });
        if (existingContent) {
            ResponseAPI.msg = `Ya existe contenido para la sección '${section}'`;
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        const newContent = await Content.create({
            section,
            title: title || '',
            body: body || ''
        });

        ResponseAPI.data = newContent;
        res.status(201).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Actualizar contenido por ID (Solo Admin) ---
export const updateContent = async (req, res, next) => {
    const { id } = req.params;
    const { section, title, body } = req.body;

    const ResponseAPI = {
        msg: "Contenido actualizado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        const content = await Content.findById(id);

        if (!content) {
            ResponseAPI.msg = "Contenido no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Actualizar solo los campos proporcionados
        if (section !== undefined) content.section = section;
        if (title !== undefined) content.title = title;
        if (body !== undefined) content.body = body;

        const updatedContent = await content.save();
        ResponseAPI.data = updatedContent;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Eliminar contenido por ID (Solo Admin) ---
export const deleteContent = async (req, res, next) => {
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Contenido eliminado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        const content = await Content.findById(id);

        if (!content) {
            ResponseAPI.msg = "Contenido no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        await Content.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};