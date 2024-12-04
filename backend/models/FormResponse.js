const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
	{
		questionId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		type: {
			type: String,
			required: true,
			enum: ['categorize', 'multiple-choice', 'text', 'image', 'cloze', 'comprehension'],
		},
		answer: {
			type: mongoose.Schema.Types.Mixed,
			required: true
		}
	},
	{ _id: true }
);

const formResponseSchema = new mongoose.Schema(
	{
		formId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Form',
			required: true,
			index: true
		},
		respondent: {
			name: {
				type: String,
				required: true
			},
			email: {
				type: String,
				required: true
			}
		},
		answers: [answerSchema],
		submittedAt: {
			type: Date,
			default: Date.now
		}
	},
	{
		timestamps: true
	}
);

formResponseSchema.index({ formId: 1, 'respondent.email': 1 });


module.exports = mongoose.model('FormResponse', formResponseSchema);