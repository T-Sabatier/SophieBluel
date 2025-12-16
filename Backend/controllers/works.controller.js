import db from '../models/index.js';
import { cloudinary } from '../config/cloudinary.js';

const Works = db.works;

export const findAll = async (req, res) => {
	const works = await Works.findAll({ include: 'category' });
	return res.status(200).json(works);
};

export const create = async (req, res) => {
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;
	const imageUrl = req.file.path; // ✅ Cloudinary retourne l'URL complète
	
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
		// Récupérer le work pour avoir l'imageUrl
		const work = await Works.findOne({ where: { id: req.params.id } });
		
		if (work && work.imageUrl) {
			// Extraire le public_id de l'URL Cloudinary
			// URL type: https://res.cloudinary.com/dw7tsavik/image/upload/v123456/sophie-bluel/image_name.jpg
			const urlParts = work.imageUrl.split('/');
			const publicIdWithExtension = urlParts[urlParts.length - 1]; // image_name.jpg
			const publicId = publicIdWithExtension.split('.')[0]; // image_name
			const folder = urlParts[urlParts.length - 2]; // sophie-bluel
			
			// Supprimer de Cloudinary
			await cloudinary.uploader.destroy(`${folder}/${publicId}`);
		}
		
		// Supprimer de la BDD
		await Works.destroy({ where: { id: req.params.id } });
		return res.status(204).json({ message: 'Work Deleted Successfully' });
	} catch (e) {
		console.error('Delete error:', e);
		return res.status(500).json({ error: new Error('Something went wrong') });
	}
};

export default { findAll, create, delete: deleteWork };