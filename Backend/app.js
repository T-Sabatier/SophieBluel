import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import bcrypt from 'bcrypt';
import db from './models/index.js';
import userRoutes from './routes/user.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import worksRoutes from './routes/works.routes.js';

// Pour obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const swaggerDocs = yaml.load('swagger.yaml');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Initialisation de la base de données
await db.sequelize.sync();
console.log("db is ready");

// ===== CRÉATION ADMIN =====
const email = "admin@test.com";
const password = "admin1234";

const exists = await db.users.findOne({ where: { email } });
if (!exists) {
  const hash = await bcrypt.hash(password, 10);
  await db.users.create({
    email,
    password: hash
  });
  console.log("Admin créé :", email, password);
}

// ===== CORRECTION DES imageUrl (localhost) =====
const works = await db.works.findAll();
const renderUrl = process.env.RENDER_EXTERNAL_URL || "https://sophiebluel-api.onrender.com";

for (const work of works) {
  if (work.imageUrl?.includes("http://localhost:5678")) {
    work.imageUrl = work.imageUrl.replace(
      "http://localhost:5678",
      renderUrl
    );
    await work.save();
  }
}
console.log("ImageUrl corrigées");

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default app;