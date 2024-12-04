const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['categorize', 'cloze', 'comprehension'],
		required: true
	},
	question: String,
	image: String,
	options: [mongoose.Schema.Types.Mixed],
	categories: [String],
	passage: String,
	subQuestions: [mongoose.Schema.Types.Mixed]
});

const formSchema = new mongoose.Schema({
	formTitle: {
		type: String,
		required: true
	},
	headerImage: String,
	questions: [questionSchema],
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

formSchema.pre('save', function(next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model('Form', formSchema);
