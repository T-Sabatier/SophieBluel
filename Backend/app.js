const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
const bcrypt = require("bcrypt");

db.sequelize.sync().then(async () => {
  console.log("db is ready");

  const email = "admin@test.com";
  const password = "admin1234";

  // selon ton export Sequelize : users ou user
  const User = db.users || db.user;

  const exists = await User.findOne({ where: { email } });
  if (!exists) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    console.log("Admin créé :", email, password);
  }
});
const works = await db.works.findAll();
for (const w of works) {
  if (w.imageUrl?.includes("http://localhost:5678")) {
    w.imageUrl = w.imageUrl.replace(
      "http://localhost:5678",
      "https://sophiebluel-api.onrender.com"
    );
    await w.save();
  }
}
console.log("imageUrl corrigées");


app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;
