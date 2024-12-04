import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormHeader from './FormHeader';
import QuestionCard from './QuestionCard';
import QuestionToolbar from './QuestionToolbar';
import { EyeIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { saveForm } from '../../api/formApi';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [headerImage, setHeaderImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: '',
      options: type === 'categorize'
        ? {
            column1: [],
            column2: [],
          }
        : [],
      image: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleSaveForm = async () => {
    try {
      setSaving(true);
      const formData = {
        formTitle,
        headerImage,
        questions, // Questions without IDs; backend will handle ID generation
        createdAt: new Date().toISOString(),
      };

      const response = await saveForm(formData); // Backend should return the saved form with IDs
      if (response && response.data) {
        alert('Form saved successfully!');
        setQuestions(response.data.questions); // Update with backend-generated IDs
      }
    } catch (error) {
      setError('Failed to save form: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const formData = {
      formTitle,
      headerImage,
      questions,
    };
    navigate('/preview', { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-xl focus:outline-none"
              placeholder="Untitled form"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreview}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSaveForm}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
            >
              <DocumentCheckIcon className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto pt-24 px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}
        <FormHeader
          formTitle={formTitle}
          setFormTitle={setFormTitle}
          headerImage={headerImage}
          onImageUpload={handleImageUpload}
        />

        <div className="mt-6 space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question._id || index} // Use _id if available; fallback to index
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          ))}
        </div>

        <QuestionToolbar onAddQuestion={addQuestion} />
      </main>
    </div>
  );
};

export default FormBuilder;
