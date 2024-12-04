const express = require('express');
const router = express.Router();
const Form = require('../models/Form');

// Get all forms
router.get('/', async (req, res) => {
	try {
		const forms = await Form.find();
		res.json(forms);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get single form
router.get('/:id', async (req, res) => {
	try {
		const form = await Form.findById(req.params.id);
		if (!form) {
			return res.status(404).json({ message: 'Form not found' });
		}
		res.json(form);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Create form
router.post('/', async (req, res) => {
	const form = new Form({
		formTitle: req.body.formTitle,
		headerImage: req.body.headerImage,
		questions: req.body.questions
	});

	try {
		const newForm = await form.save();
		res.status(201).json(newForm);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Update form
router.put('/:id', async (req, res) => {
	try {
		const form = await Form.findById(req.params.id);
		if (!form) {
			return res.status(404).json({ message: 'Form not found' });
		}

		form.formTitle = req.body.formTitle;
		form.headerImage = req.body.headerImage;
		form.questions = req.body.questions;

		const updatedForm = await form.save();
		res.json(updatedForm);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete form
router.delete('/:id', async (req, res) => {
	try {
		const form = await Form.findById(req.params.id);
		if (!form) {
			return res.status(404).json({ message: 'Form not found' });
		}
		await form.remove();
		res.json({ message: 'Form deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;