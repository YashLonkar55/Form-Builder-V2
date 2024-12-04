import express from 'express';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import { generateShareableLink } from '../utils/generateShareableLink.js';

const router = express.Router();

// Create shareable link for a form
router.post('/forms/:formId/share', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (!form.shareableLink) {
      form.shareableLink = generateShareableLink();
      await form.save();
    }

    res.json({ shareableLink: form.shareableLink });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form by shareable link
router.get('/forms/shared/:shareableLink', async (req, res) => {
  try {
    const form = await Form.findOne({ shareableLink: req.params.shareableLink });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit form response
router.post('/forms/shared/:shareableLink/submit', async (req, res) => {
  try {
    const form = await Form.findOne({ shareableLink: req.params.shareableLink });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const response = new Response({
      formId: form._id,
      answers: req.body.answers
    });

    await response.save();
    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;