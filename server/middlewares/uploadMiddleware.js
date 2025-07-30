import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const uploadPath = path.join('uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      req.userId = userId; 
      cb(null, uploadPath);
    } catch (e) {
      cb(new Error('Token inválido ou ausente'));
    }
  },
  filename: function (req, file, cb) {
    const userId = req.userId || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);

    const filename = `${userId}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

export default upload;
