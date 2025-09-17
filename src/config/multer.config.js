import multer from 'multer';
import { __dirname } from '../utils.js'; // Asegúrate de que esta ruta a __dirname sea correcta
import path from 'path';

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    // 'destination' define dónde se guardarán los archivos subidos.
    // Los archivos se guardarán en la carpeta 'public/images' dentro de tu proyecto.
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    // 'filename' define cómo se nombrará el archivo una vez guardado.
    // Usamos el timestamp y el nombre original para asegurar unicidad.
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro de archivos para aceptar solo imágenes (JPEG, JPG, PNG)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true); // Acepta el archivo
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes JPG, JPEG y PNG.'), false);
    }
};

// Crea la instancia de Multer con la configuración de almacenamiento y filtro.
export const uploader = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});
