import React, { useState, useEffect } from 'react';

const CategorizeQuestion = ({ question, updateQuestion, isEditing }) => {
  const [newOption, setNewOption] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('column1');
  const [draggedItem, setDraggedItem] = useState(null);

  // Initialize options if they don't exist
  useEffect(() => {
    if (!question.options) {
      updateQuestion({
        ...question,
        options: { column1: [], column2: [] },
        optionsPool: question.optionsPool || []
      });
    }
  }, []);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedItem) return;

    const updatedColumns = {
      column1: [...(question.options?.column1 || [])],
      column2: [...(question.options?.column2 || [])],
    };

    // Remove from optionsPool if the item is coming from there
    const updatedOptionsPool = (question.optionsPool || []).filter(
      (item) => item.text !== draggedItem.text
    );

    // Remove from both columns if it exists
    updatedColumns.column1 = updatedColumns.column1.filter(
      (item) => item.text !== draggedItem.text
    );
    updatedColumns.column2 = updatedColumns.column2.filter(
      (item) => item.text !== draggedItem.text
    );

    // Add to target column
    updatedColumns[targetColumn].push(draggedItem);

    updateQuestion({
      ...question,
      optionsPool: updatedOptionsPool,
      options: updatedColumns,
    });

    setDraggedItem(null);
  };

  const addOption = () => {
    if (!newOption.trim()) return;

    const newItem = {
      text: newOption.trim(),
      correctColumn: selectedColumn
    };

    // Add new option to the optionsPool instead of directly to columns
    const currentOptions = getAllOptions();
    if (!currentOptions.find(item => item.text === newItem.text)) {
      updateQuestion({
        ...question,
        optionsPool: [...(question.optionsPool || []), newItem]
      });
    }

    setNewOption('');
  };

  const removeOption = (item) => {
    // Remove from optionsPool
    const updatedOptionsPool = (question.optionsPool || []).filter(
      (i) => i.text !== item.text
    );

    // Also remove from columns if present
    const updatedColumns = {
      column1: question.options.column1.filter((i) => i.text !== item.text),
      column2: question.options.column2.filter((i) => i.text !== item.text),
    };

    updateQuestion({
      ...question,
      optionsPool: updatedOptionsPool,
      options: updatedColumns,
    });
  };

  const getAllOptions = () => {
    const placedOptions = new Set([
      ...question.options.column1.map(o => o.text),
      ...question.options.column2.map(o => o.text)
    ]);
    
    if (isEditing) {
      return question.optionsPool || [];
    }
    
    // In preview mode, only show options that aren't already placed
    return (question.optionsPool || []).filter(
      option => !placedOptions.has(option.text)
    );
  };


  return (
    <div className="mt-4">
      {isEditing && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={question.question || ''}
              onChange={(e) =>
                updateQuestion({ ...question, question: e.target.value })
              }
              placeholder="Enter question text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="column1">Column 1</option>
              <option value="column2">Column 2</option>
            </select>
            <button
              onClick={addOption}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </>
      )}

      <div className="space-y-4">
        {/* Options Pool */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">
            {isEditing ? 'Options' : 'Drag options to their correct columns'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {getAllOptions().map((item, index) => (
              <div
                key={index}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item)}
                className="bg-white border border-gray-200 p-2 rounded cursor-move hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <span>{item.text}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeOption(item)}
                      className="text-red-500 hover:text-red-600 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-4">
          {['column1', 'column2'].map((columnName) => (
          <div
            key={columnName}
            className="border rounded-lg p-4 min-h-[200px] bg-white"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnName)}
          >
            <h4 className="font-semibold mb-2">
            {columnName === 'column1' ? 'Column 1' : 'Column 2'}
            </h4>
            <div className="space-y-2">
            {question.options?.[columnName]?.map((item, index) => (
              <div
              key={index}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, item)}
              className="bg-white p-2 rounded border border-gray-300 cursor-move"
              >
              {item.text}
              </div>
            ))}
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
