import { Sequelize } from 'sequelize';
import config from '../config/db.config.js';
import usersModel from './users.model.js';
import worksModel from './works.model.js';
import categoriesModel from './categories.model.js';

const sequelize = new Sequelize('project6-db', 'user', 'pass', config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = usersModel(sequelize, Sequelize);
db.works = worksModel(sequelize, Sequelize);
db.categories = categoriesModel(sequelize, Sequelize);

// Works and Categories Relationships
db.categories.hasMany(db.works, { as: "works" });
db.works.belongsTo(db.categories, {
	foreignKey: 'categoryId',
	as: 'category'
});

// Works and Users Relationships
db.users.hasMany(db.works, { as: "works" });
db.works.belongsTo(db.users, {
	foreignKey: 'userId',
	as: 'user'
});

export default db;