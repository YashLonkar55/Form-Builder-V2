import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

const QuestionToolbar = ({ onAddQuestion }) => {
  const questionTypes = [
    { type: 'categorize', label: 'Categorize', color: 'emerald' },
    { type: 'cloze', label: 'Cloze', color: 'blue' },
    { type: 'comprehension', label: 'Comprehension', color: 'purple' }
  ];

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2">
      {questionTypes.map(({ type, label, color }) => (
        <button
          key={type}
          onClick={() => onAddQuestion(type)}
          className={`flex items-center px-4 py-2 bg-${color}-500 text-white rounded-full shadow-lg hover:bg-${color}-600 transition-colors`}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default QuestionToolbar;