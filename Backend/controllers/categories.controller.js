import db from '../models/index.js';

const Categories = db.categories;

export const findAll = async (req, res) => {
	try {
		const works = await Categories.findAll();
		return res.status(200).json(works);
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};

export const create = async (req, res) => {
	const category = await Categories.create({
		name: req.body.name
	});
	return res.status(201).json(category);
};

export default { findAll, create };