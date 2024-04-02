import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // Importa CORS

// Asegurarse de que la carpeta multimedia exista
const multimediaDir = path.join(__dirname, 'multimedia');
if (!fs.existsSync(multimediaDir)){
    fs.mkdirSync(multimediaDir, { recursive: true });
}


const app = express();
const port = 5000;
app.use(cors()); // Usa CORS aquí


// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, multimediaDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        console.log("GUARDADO")
    }
});

const upload = multer({ storage: storage });    

app.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), (req, res) => {
    // console.log("")
    // console.log("")
    // console.log("")
    console.log('ID recibido:', req.body.id);
    // console.log('Archivos recibidos:', req.files);
    res.send('{"staus":"Ok"}');
});
app.get('/upload', (req, res) => {
    
    res.send('Get Upload');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
