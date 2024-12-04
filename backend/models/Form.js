const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    required: true,
  },
  headerImage: {
    type: String,
  },
  questions: [{
    id: String,
    type: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    required: Boolean,
    section: String,
    options: mongoose.Schema.Types.Mixed,
    image: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', formSchema);

