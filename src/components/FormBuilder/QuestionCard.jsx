import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import CategorizeQuestion from './QuestionTypes/CategorizeQuestion';
import ClozeQuestion from './QuestionTypes/ClozeQuestion';
import ComprehensionQuestion from './QuestionTypes/ComprehensionQuestion';
import clsx from 'clsx';

const QuestionCard = ({ question, questions, setQuestions }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const updateQuestion = (updatedQuestion) => {
    const newQuestions = questions.map((q) =>
      q.id === question.id ? { ...q, ...updatedQuestion } : q
    );
    setQuestions(newQuestions);
  };

  const deleteQuestion = () => {
    const newQuestions = questions.filter((q) => q.id !== question.id);
    setQuestions(newQuestions);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion({ ...question, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderQuestionType = () => {
    const props = { question, updateQuestion, isEditing };
    switch (question.type) {
      case 'categorize':
        return <CategorizeQuestion {...props} />;
      case 'cloze':
        return <ClozeQuestion {...props} />;
      case 'comprehension':
        return <ComprehensionQuestion {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 transition-shadow',
        isHovered && 'shadow-lg'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-100"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={deleteQuestion}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {question.image && (
              <img
                src={question.image}
                alt="Question"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        )}

        {renderQuestionType()}
      </div>
    </div>
  );
};

export default QuestionCard;