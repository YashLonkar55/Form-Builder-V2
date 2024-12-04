const express = require('express');
const router = express.Router();
const Form = require('../../models/Form');

// Create a new form
router.post('/api/forms', async (req, res) => {
	try {
		const form = new Form(req.body);
		await form.save();
		res.status(201).json(form);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Get a form by ID
router.get('/api/forms/:id', async (req, res) => {
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

module.exports = router;