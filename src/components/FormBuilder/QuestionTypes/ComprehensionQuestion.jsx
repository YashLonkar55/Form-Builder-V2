import React from 'react';

const ComprehensionQuestion = ({ question, updateQuestion, isEditing }) => {
  const addSubQuestion = () => {
    const newSubQuestions = [
      ...(question.subQuestions || []),
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ];
    updateQuestion({ ...question, subQuestions: newSubQuestions });
  };

  const updateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[index] = {
      ...newSubQuestions[index],
      [field]: value,
    };
    updateQuestion({ ...question, subQuestions: newSubQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[questionIndex].options[optionIndex] = value;
    updateQuestion({ ...question, subQuestions: newSubQuestions });
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = question.subQuestions.filter((_, i) => i !== index);
    updateQuestion({ ...question, subQuestions: newSubQuestions });
  };

  return (
    <div className="mt-4">
      {isEditing ? (
        <>
          <div className="mb-4">
            <textarea
              value={question.passage || ''}
              onChange={(e) =>
                updateQuestion({ ...question, passage: e.target.value })
              }
              placeholder="Enter the comprehension passage"
              className="w-full p-2 border rounded min-h-[150px]"
            />
          </div>

          <div className="space-y-4">
            {(question.subQuestions || []).map((subQ, index) => (
              <div key={subQ.id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Question {index + 1}</h4>
                  <button
                    onClick={() => removeSubQuestion(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={subQ.question}
                  onChange={(e) =>
                    updateSubQuestion(index, 'question', e.target.value)
                  }
                  placeholder="Enter question"
                  className="w-full p-2 border rounded mb-2"
                />
                {subQ.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name={`correct-${subQ.id}`}
                      checked={subQ.correctAnswer === optionIndex}
                      onChange={() =>
                        updateSubQuestion(index, 'correctAnswer', optionIndex)
                      }
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(index, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={addSubQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <p className="whitespace-pre-wrap">{question.passage}</p>
          </div>
          <div className="space-y-4">
            {(question.subQuestions || []).map((subQ, index) => (
              <div key={subQ.id} className="border rounded p-4">
                <h4 className="font-semibold mb-2">
                  Question {index + 1}: {subQ.question}
                </h4>
                <div className="space-y-2">
                  {subQ.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`answer-${subQ.id}`}
                        disabled={!isEditing}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComprehensionQuestion;