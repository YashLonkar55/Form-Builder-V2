import React, { useState } from 'react';
import CategorizeQuestion from '../FormBuilder/QuestionTypes/CategorizeQuestion';
import ClozeQuestion from '../FormBuilder/QuestionTypes/ClozeQuestion';
import ComprehensionQuestion from '../FormBuilder/QuestionTypes/ComprehensionQuestion';

const PreviewQuestion = ({ question, index, updateQuestion, onOptionReorder }) => {
  const [response, setResponse] = useState(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-500">Question {index + 1}</span>
        {question.image && (
          <img
            src={question.image}
            alt={`Question ${index + 1}`}
            className="mt-2 max-h-40 object-contain"
          />
        )}
      </div>
      
      {question.type === 'categorize' && (
        <CategorizeQuestion
          question={question}
          updateQuestion={updateQuestion}
          isEditing={false}
          response={response}
          setResponse={setResponse}
          onOptionReorder={onOptionReorder}
        />
      )}
      
      {question.type === 'cloze' && (
        <ClozeQuestion
          question={question}
          isEditing={false}
          response={response}
          setResponse={setResponse}
          updateQuestion={updateQuestion}
          onOptionReorder={onOptionReorder}
        />
      )}
      
      {question.type === 'comprehension' && (
        <ComprehensionQuestion
          question={question}
          isEditing={false}
          response={response}
          setResponse={setResponse}
          updateQuestion={updateQuestion}
          onOptionReorder={onOptionReorder}
        />
      )}
    </div>
  );
};

export default PreviewQuestion;