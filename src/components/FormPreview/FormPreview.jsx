import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PreviewQuestion from './PreviewQuestion';

const FormPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(null);

  React.useEffect(() => {
    const data = location.state?.formData;
    if (!data) {
      navigate('/', { replace: true });
      return;
    }
    setFormData(data);
  }, [location.state, navigate]);

  const handleBackToEditor = () => {
    // Pass the form data back to the editor
    navigate('/', { state: { formData } });
  };

  const handleQuestionUpdate = (questionId, updatedQuestion) => {
    setFormData(prevData => ({
      ...prevData,
      questions: prevData.questions.map(q =>
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };

  const handleOptionReorder = (questionId, sourceIndex, destinationIndex) => {
    setFormData(prevData => {
      const updatedQuestions = prevData.questions.map(question => {
        if (question.id === questionId) {
          const newOptions = Array.from(question.options);
          const [removed] = newOptions.splice(sourceIndex, 1);
          newOptions.splice(destinationIndex, 0, removed);
          return {
            ...question,
            options: newOptions
          };
        }
        return question;
      });

      return {
        ...prevData,
        questions: updatedQuestions
      };
    });
  };

  const renderQuestionsBySection = () => {
    if (!formData?.questions?.length) return null;

    let currentSection = null;
    return formData.questions.map((question, index) => {
      const showSectionHeader = question.section !== currentSection;
      if (showSectionHeader) {
        currentSection = question.section;
      }

      return (
        <React.Fragment key={question.id}>
          {showSectionHeader && question.section && (
            <h2 className="text-lg font-medium text-gray-700 mb-4">{question.section}</h2>
          )}
          <PreviewQuestion
            question={question}
            index={index}
            updateQuestion={(updatedQuestion) => 
              handleQuestionUpdate(question.id, updatedQuestion)
            }
            onOptionReorder={(sourceIndex, destinationIndex) =>
              handleOptionReorder(question.id, sourceIndex, destinationIndex)
            }
          />
        </React.Fragment>
      );
    });
  };


  if (!formData) {
    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">No form data available</h2>
          <button
          onClick={handleBackToEditor}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
          Return to Form Builder
          </button>
        </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={handleBackToEditor}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Form Preview</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto pt-24 px-4">
        <div className="bg-white rounded-lg shadow">
          {formData.headerImage && (
            <div className="h-40 w-full overflow-hidden rounded-t-lg">
              <img
                src={formData.headerImage}
                alt="Form header"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-normal mb-8">{formData.formTitle}</h1>
            <div className="space-y-6">
              {renderQuestionsBySection()}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default FormPreview;