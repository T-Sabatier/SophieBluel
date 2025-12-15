import db from '../models/index.js';

const Works = db.works;

export const findAll = async (req, res) => {
	const works = await Works.findAll({ include: 'category' });
	return res.status(200).json(works);
};

export const create = async (req, res) => {
	const host = req.get('host');
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;
	const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
	try {
		const work = await Works.create({
			title,
			imageUrl,
			categoryId,
			userId
		});
		return res.status(201).json(work);
	} catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};

export const deleteWork = async (req, res) => {
	try {
		await Works.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Work Deleted Successfully' });
	} catch (e) {
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};

export default { findAll, create, delete: deleteWork };