import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormHeader from './FormHeader';
import QuestionCard from './QuestionCard';
import QuestionToolbar from './QuestionToolbar';
import SharedModal from '../SharedForm/ShareForm';
import { ShareIcon, TrashIcon, EyeIcon, DocumentCheckIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { saveForm } from '../../api/formApi';

const FormBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [headerImage, setHeaderImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [savedFormId, setSavedFormId] = useState(null);
  const [showSharedModal, setShowSharedModal] = useState(false);

  useEffect(() => {
    if (location.state?.formData) {
      const { formTitle: savedTitle, headerImage: savedImage, questions: savedQuestions } = location.state.formData;
      setFormTitle(savedTitle);
      setHeaderImage(savedImage);
      setQuestions(savedQuestions);
    }
    const storedFormId = localStorage.getItem('currentFormId');
    if (storedFormId) {
      setSavedFormId(storedFormId);
    }
  }, [location.state]);

  useEffect(() => {
    const currentForm = {
      formTitle,
      headerImage,
      questions,
    };
    localStorage.setItem('currentForm', JSON.stringify(currentForm));
  }, [formTitle, headerImage, questions]);

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
      id: Date.now(),
      type,
      question: '',
      required: false,
      section: '',
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

      if (!formTitle.trim()) {
        throw new Error('Form title is required');
      }

      if (!questions.length) {
        throw new Error('Form must have at least one question');
      }

      const invalidQuestions = questions.filter(q => !q.question || !q.question.trim());
      if (invalidQuestions.length > 0) {
        throw new Error('All questions must have content');
      }

      const formData = {
        formTitle,
        headerImage,
        questions: questions.map(q => ({
          ...q,
          question: q.question.trim(),
          required: !!q.required,
          options: Array.isArray(q.options) ? q.options.filter(opt => opt.trim()) : q.options
        })),
        createdAt: new Date().toISOString(),
      };

      console.log('Sending form data:', formData);

      const savedForm = await saveForm(formData);
      console.log('Form saved successfully:', savedForm);
      
      // Ensure we're setting the correct ID from the saved form
      const formId = savedForm.id || savedForm._id; // Handle different possible ID formats
      setSavedFormId(formId);
      
      // Store the form ID in localStorage for persistence
      localStorage.setItem('currentFormId', formId);
      setShowSavePopup(true);
      
      // Show success message
      alert('Form saved successfully!');
      return formId; // Return the form ID for immediate use if needed
    } catch (error) {
      console.error('Detailed save error:', error);
      alert('Failed to save form: ' + error.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const currentFormId = savedFormId || localStorage.getItem('currentFormId');
    if (!currentFormId) {
      alert('Please save the form first to get a share link.');
      return;
    }
    setShowSharedModal(true);
  };

  const clearForm = () => {
    const confirmClear = window.confirm('Are you sure you want to clear the form? This action cannot be undone.');
    if (confirmClear) {
      setQuestions([]);
      setFormTitle('Untitled Form');
      setHeaderImage(null);
      setSavedFormId(null);
      localStorage.removeItem('currentForm');
      localStorage.removeItem('currentFormId'); // Also remove the stored form ID
    }
  };

  const handlePreview = () => {
    // Store current form data in localStorage
    const previewData = {
      formTitle,
      headerImage,
      questions
    };
    localStorage.setItem('previewForm', JSON.stringify(previewData));
    // Navigate to preview page
    navigate('/preview');
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    const elements = document.querySelectorAll('.group');
    elements.forEach(element => {
      element.style.borderColor = 'transparent';
    });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const elements = document.querySelectorAll('.group');
    elements[index].style.borderColor = '#9333ea';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(dragIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedItem);
    setQuestions(newQuestions);
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
              onClick={clearForm}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear Form
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Preview
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
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
        <FormHeader
          formTitle={formTitle}
          setFormTitle={setFormTitle}
          headerImage={headerImage}
          onImageUpload={handleImageUpload}
        />

        <div className="mt-6 space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className="transition-all border-transparent border-4 group"
            >
              <div className="flex items-start gap-2 bg-white rounded-lg shadow-sm p-6">
                <div className="cursor-move mt-2">
                  <Bars3Icon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={question.section || ''}
                      onChange={(e) => handleSectionChange(question.id, e.target.value)}
                      placeholder="Section name (optional)"
                      className="w-full border-b border-gray-200 pb-1 text-sm text-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <QuestionCard
                    question={question}
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <QuestionToolbar onAddQuestion={addQuestion} />
      </main>

      <SharedModal
        formId={savedFormId}
        isOpen={showSharedModal}
        onClose={() => setShowSharedModal(false)}
      />
    </div>
  );
};

export default FormBuilder;