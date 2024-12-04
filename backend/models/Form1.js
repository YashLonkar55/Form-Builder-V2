const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['categorize', 'multiple-choice', 'text', 'image', 'cloze', 'comprehension'],
    },
    question: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: '',
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: function() {
        return this.type === 'categorize' ? { column1: [], column2: [] } : [];
      }
    },
    image: {
      type: String,
      default: null,
    },
    // Additional fields for specific question types
    categories: [String],
    passage: String,
    subQuestions: [mongoose.Schema.Types.Mixed]
  },
  { _id: true }
);

const formSchema = new mongoose.Schema(
  {
    formTitle: {
      type: String,
      required: true,
      default: 'Untitled Form',
      index: true,
    },
    headerImage: {
      type: String,
      default: null,
    },
    questions: [questionSchema],
    shareId: {
      type: String,
      required: true,
      unique: true,
      default: () => Math.random().toString(36).substr(2, 9)
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('Form', formSchema);
