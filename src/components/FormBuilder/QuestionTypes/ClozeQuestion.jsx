import React, { useState, useRef } from 'react';

const ClozeQuestion = ({ question, updateQuestion, isEditing }) => {
  const [selectedText, setSelectedText] = useState('');
  const [draggedOption, setDraggedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const blanksRef = useRef([]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

  const createBlank = () => {
    if (!selectedText) return;

    const text = question.question || '';
    const blankId = `blank_${Date.now()}`;
    const newText = text.replace(selectedText, `[${blankId}]`);
    const newOptions = [...(question.options || [])];
    if (!newOptions.includes(selectedText)) {
      newOptions.push(selectedText);
    }

    updateQuestion({
      ...question,
      question: newText,
      options: newOptions,
      blanks: {
        ...(question.blanks || {}),
        [blankId]: selectedText
      }
    });

    setSelectedText('');
  };

  const removeOption = (optionToRemove) => {
    const newOptions = question.options.filter((option) => option !== optionToRemove);
    updateQuestion({
      ...question,
      options: newOptions,
    });
  };

  const handleDragStart = (e, option) => {
    setDraggedOption(option);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    setDraggedOption(null);
    e.target.classList.remove('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, blankId) => {
    e.preventDefault();
    if (!draggedOption) return;

    setAnswers({
      ...answers,
      [blankId]: draggedOption
    });
  };

  const renderText = () => {
    if (!question.question) return null;

    const parts = question.question.split(/(\[blank_\d+\])/g);
    return parts.map((part, index) => {
      if (part.match(/\[blank_\d+\]/)) {
        const blankId = part.slice(1, -1);
        return (
          <span
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blankId)}
            className={`inline-block min-w-[100px] mx-1 px-2 py-1 border-b-2 ${
              answers[blankId]
                ? 'bg-green-50 border-green-500'
                : 'border-gray-300'
            }`}
          >
            {answers[blankId] || '_____'}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="mt-4">
      {isEditing ? (
        <>
          <div className="mb-4">
            <textarea
              value={question.question || ''}
              onChange={(e) =>
                updateQuestion({ ...question, question: e.target.value })
              }
              onMouseUp={handleTextSelection}
              placeholder="Enter your text here. Select words to convert them into blanks."
              className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {selectedText && (
            <button
              onClick={createBlank}
              className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create Blank for: {selectedText}
            </button>
          )}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Answer Options:</h4>
            <div className="flex flex-wrap gap-2">
              {(question.options || []).map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{option}</span>
                  <button
                    onClick={() => removeOption(option)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="mb-4 text-lg">{renderText()}</div>
          <div className="flex flex-wrap gap-2">
            {(question.options || []).map((option, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
                onDragEnd={handleDragEnd}
                className="bg-gray-100 px-3 py-1 rounded-full cursor-move hover:bg-gray-200 transition-colors"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClozeQuestion;