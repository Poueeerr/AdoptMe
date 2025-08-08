import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const upload = multer({ storage: multer.memoryStorage() });

const processImages = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const uploadPath = path.join('uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const processedFiles = [];

    if (!req.files || req.files.length === 0) return next();

    for (const file of req.files) {
      const ext = path.extname(file.originalname) || '.jpg';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${userId}-${uniqueSuffix}${ext}`;
      const outputPath = path.join(uploadPath, filename);

      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1080, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      processedFiles.push(filename);
    }

    req.processedFiles = processedFiles;
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao processar imagens ou token inválido' });
  }
};

export { upload, processImages };
