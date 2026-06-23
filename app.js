require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET wajib diisi di file .env');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. DATABASE INITIALIZATION & CONNECTION
const dbName = process.env.DB_NAME || 'portfolio';
const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
let sequelize;

async function initDB() {
    const connection = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mysql',
        logging: false
    });

    defineModels();
    registerModelRoutes();
    await sequelize.sync({ alter: true });
    await seedAdmin();
}

// 2. MODELS DEFINITION
let User, Hero, Profil, Skill, Project, Pengalaman, Layanan, Testimoni, Artikel, Kontak, Pengaturan;

function defineModels() {
    User = sequelize.define('User', {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false }
    });

    Hero = sequelize.define('Hero', {
        nama: DataTypes.STRING, role: DataTypes.STRING, headline: DataTypes.STRING, deskripsi: DataTypes.TEXT
    });

    Profil = sequelize.define('Profil', {
        deskripsi: DataTypes.TEXT, keahlian: DataTypes.TEXT, fokus: DataTypes.TEXT
    });

    Skill = sequelize.define('Skill', {
        nama: DataTypes.STRING,
        tingkat: DataTypes.INTEGER,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true }
    });

    Project = sequelize.define('Project', {
        judul: DataTypes.STRING, thumbnail: DataTypes.STRING, deskripsiSingkat: DataTypes.TEXT,
        deskripsiLengkap: DataTypes.TEXT, kategori: DataTypes.STRING, teknologi: DataTypes.STRING,
        linkDemo: DataTypes.STRING, linkGithub: DataTypes.STRING, linkDokumentasi: DataTypes.STRING,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true },
        featured: { type: DataTypes.BOOLEAN, defaultValue: false },
        urutan: { type: DataTypes.INTEGER, defaultValue: 0 }
    });

    Pengalaman = sequelize.define('Pengalaman', {
        posisi: DataTypes.STRING, perusahaan: DataTypes.STRING, periode: DataTypes.STRING,
        tanggungJawab: DataTypes.TEXT,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true }
    });

    Layanan = sequelize.define('Layanan', {
        nama: DataTypes.STRING, deskripsi: DataTypes.TEXT,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
    Testimoni = sequelize.define('Testimoni', {
        nama: DataTypes.STRING, perusahaan: DataTypes.STRING, review: DataTypes.TEXT,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
    Artikel = sequelize.define('Artikel', {
        judul: DataTypes.STRING, konten: DataTypes.TEXT, tanggal: DataTypes.STRING,
        statusTampil: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
    Kontak = sequelize.define('Kontak', { whatsapp: DataTypes.STRING, email: DataTypes.STRING, linkedin: DataTypes.STRING, github: DataTypes.STRING, lokasi: DataTypes.STRING });
    Pengaturan = sequelize.define('Pengaturan', {
        namaWebsite: DataTypes.STRING,
        logo: DataTypes.STRING,
        footerNote: DataTypes.STRING,
        showHero: { type: DataTypes.BOOLEAN, defaultValue: true },
        showProfil: { type: DataTypes.BOOLEAN, defaultValue: true },
        showSkills: { type: DataTypes.BOOLEAN, defaultValue: true },
        showProjects: { type: DataTypes.BOOLEAN, defaultValue: true },
        showPengalaman: { type: DataTypes.BOOLEAN, defaultValue: true },
        showLayanan: { type: DataTypes.BOOLEAN, defaultValue: true },
        showTestimoni: { type: DataTypes.BOOLEAN, defaultValue: true },
        showArtikel: { type: DataTypes.BOOLEAN, defaultValue: true },
        showKontak: { type: DataTypes.BOOLEAN, defaultValue: true },
        showFooter: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
}

// Default Seed Data
async function seedAdmin() {
    const adminCount = await User.count();
    if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({ username: 'admin', password: hashedPassword });
        await Hero.create({ nama: 'John Doe', role: 'Full Stack Developer', headline: 'Building Scalable Apps', deskripsi: 'Professional Software Engineer experienced in Node.js & Vue.js' });
        await Pengaturan.create({ namaWebsite: 'DevPortfolio', logo: '🚀', footerNote: '© 2026 Professional Portfolio' });
        await Kontak.create({ whatsapp: '62812345678', email: 'john@dev.com', linkedin: 'linkedin.com/in/john', github: 'github.com/john', lokasi: 'Jakarta, Indonesia' });
    }
}

// 3. MIDDLEWARE AUTH
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authenticateOptional = (req, res, next) => {
    if (!req.headers['authorization']) return next();
    authenticateToken(req, res, next);
};

// Image upload to Cloudflare R2. Files stay in memory only until sent to R2.
const allowedImageTypes = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif']
]);
const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'));
        }
        callback(null, true);
    }
});

function getR2Config() {
    const config = {
        endpoint: process.env.R2_ENDPOINT,
        bucket: process.env.R2_BUCKET,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        publicBaseUrl: process.env.R2_PUBLIC_BASE_URL
    };
    const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key);
    if (missing.length) throw new Error(`Konfigurasi R2 belum lengkap: ${missing.join(', ')}`);
    return config;
}

function buildPublicImageUrl(baseUrl, objectKey) {
    const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
    return `${baseUrl.replace(/\/$/, '')}/${encodedKey}`;
}

// 4. API ROUTES

app.post('/api/uploads/images', authenticateToken, (req, res) => {
    imageUpload.single('image')(req, res, async (uploadError) => {
        if (uploadError) {
            const isSizeError = uploadError.code === 'LIMIT_FILE_SIZE';
            return res.status(400).json({
                message: isSizeError
                    ? 'Ukuran gambar maksimal 5 MB'
                    : 'File harus berupa JPG, PNG, WebP, atau GIF'
            });
        }
        if (!req.file) return res.status(400).json({ message: 'File gambar wajib dipilih' });

        try {
            const config = getR2Config();
            const now = new Date();
            const objectKey = [
                'portfolio',
                'projects',
                String(now.getUTCFullYear()),
                String(now.getUTCMonth() + 1).padStart(2, '0'),
                `${crypto.randomUUID()}.${allowedImageTypes.get(req.file.mimetype)}`
            ].join('/');
            const r2 = new S3Client({
                region: 'auto',
                endpoint: config.endpoint,
                credentials: {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey
                }
            });

            await r2.send(new PutObjectCommand({
                Bucket: config.bucket,
                Key: objectKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                CacheControl: 'public, max-age=31536000, immutable'
            }));

            res.status(201).json({
                message: 'Gambar berhasil diunggah',
                key: objectKey,
                url: buildPublicImageUrl(config.publicBaseUrl, objectKey)
            });
        } catch (error) {
            console.error('R2 upload failed:', error.message);
            res.status(502).json({ message: 'Gagal mengunggah gambar ke penyimpanan' });
        }
    });
});

// Auth
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Incorrect username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
});

app.get('/api/auth/session', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

app.put('/api/auth/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
            return res.status(400).json({ message: 'Password saat ini dan password baru wajib diisi' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password baru minimal 8 karakter' });
        }
        if (Buffer.byteLength(newPassword, 'utf8') > 72) {
            return res.status(400).json({ message: 'Password baru maksimal 72 byte' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Password saat ini tidak sesuai' });
        }
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: 'Password baru harus berbeda dari password saat ini' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        res.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        console.error('Password update failed:', error.message);
        res.status(500).json({ message: 'Password tidak dapat diperbarui' });
    }
});

// Dashboard statistics API for Chart.js
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    res.json({
        labels: ['Skills', 'Projects', 'Experience', 'Services', 'Testimonials', 'Articles'],
        barData: [await Skill.count(), await Project.count(), await Pengalaman.count(), await Layanan.count(), await Testimoni.count(), await Artikel.count()],
        lineData: [5, 12, 19, 25, 28, 35], // Placeholder monthly project growth
        areaData: [100, 250, 400, 600, 850, 1100] // Placeholder cumulative views
    });
});

function registerModelRoutes() {
    // Singleton resources
    const makeSingletonRoutes = (routePath, Model) => {
        app.get(`/api/${routePath}`, authenticateOptional, async (req, res) => {
            let data = await Model.findOne();
            if (!data) data = await Model.create({});
            res.json(data);
        });
        app.put(`/api/${routePath}`, authenticateToken, async (req, res) => {
            let data = await Model.findOne();
            if (!data) data = await Model.create(req.body);
            else await data.update(req.body);
            res.json({ message: 'Data updated successfully', data });
        });
    };

    makeSingletonRoutes('hero', Hero);
    makeSingletonRoutes('profil', Profil);
    makeSingletonRoutes('kontak', Kontak);
    makeSingletonRoutes('pengaturan', Pengaturan);

    // CRUD routes with search, limits, and pagination
    const makeCrudRoutes = (routePath, Model, searchField) => {
        app.get(`/api/${routePath}`, authenticateOptional, async (req, res) => {
            let { page = 1, limit = 6, search = '' } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);

            const whereClause = {};
            if (search) {
                whereClause[searchField] = { [Op.like]: `%${search}%` };
            }

            // Public requests only receive entries selected for the landing page.
            if (!req.user && ['projects', 'skills', 'pengalaman', 'layanan', 'testimoni', 'artikel'].includes(routePath)) {
                whereClause.statusTampil = true;
            }

            const { count, rows } = await Model.findAndCountAll({
                where: whereClause,
                limit,
                offset: (page - 1) * limit,
                order: routePath === 'projects' ? [['urutan', 'ASC']] : [['id', 'DESC']]
            });

            res.json({ data: rows, total: count, page, totalPages: Math.ceil(count / limit) });
        });

        app.post(`/api/${routePath}`, authenticateToken, async (req, res) => {
            const item = await Model.create(req.body);
            res.json({ message: 'Data added successfully', item });
        });

        app.put(`/api/${routePath}/:id`, authenticateToken, async (req, res) => {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: 'Data not found' });
            await item.update(req.body);
            res.json({ message: 'Data updated successfully' });
        });

        app.delete(`/api/${routePath}/:id`, authenticateToken, async (req, res) => {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: 'Data not found' });
            await item.destroy();
            res.json({ message: 'Data deleted successfully' });
        });
    };

    makeCrudRoutes('projects', Project, 'judul');
    makeCrudRoutes('skills', Skill, 'nama');
    makeCrudRoutes('pengalaman', Pengalaman, 'perusahaan');
    makeCrudRoutes('layanan', Layanan, 'nama');
    makeCrudRoutes('testimoni', Testimoni, 'nama');
    makeCrudRoutes('artikel', Artikel, 'judul');
}

// START SERVER
initDB().then(() => {
    // Fallback harus didaftarkan setelah seluruh API agar request /api tidak
    // tertangkap dan dikembalikan sebagai HTML landing page.
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => console.error('Database connection failed:', err));
