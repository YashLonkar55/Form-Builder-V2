const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const FormResponse = require('../models/FormResponse');

// Submit a form response
router.post('/submit/:shareId', async (req, res) => {
	try {
		const form = await Form.findOne({ shareId: req.params.shareId });
		if (!form) {
			return res.status(404).json({ message: 'Form not found' });
		}

		if (!form.isShareable) {
			return res.status(403).json({ message: 'Form is not shareable' });
		}

		if (form.shareSettings.expiresAt && new Date() > form.shareSettings.expiresAt) {
			return res.status(403).json({ message: 'Form has expired' });
		}

		if (form.shareSettings.submitOnce && form.shareSettings.collectEmail) {
			const existingResponse = await FormResponse.findOne({
				formId: form._id,
				'respondent.email': req.body.respondent.email
			});
			if (existingResponse) {
				return res.status(403).json({ message: 'You have already submitted this form' });
			}
		}

		const formResponse = new FormResponse({
			formId: form._id,
			respondent: req.body.respondent,
			answers: req.body.answers
		});

		await formResponse.save();
		res.status(201).json({ message: 'Form response submitted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get form responses for a specific form (protected route)
router.get('/:formId', async (req, res) => {
	try {
		const responses = await FormResponse.find({ formId: req.params.formId })
			.sort({ submittedAt: -1 });
		res.json(responses);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;