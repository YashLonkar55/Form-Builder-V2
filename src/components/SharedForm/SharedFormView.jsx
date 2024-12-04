import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFormByShareableLink, submitFormResponse } from '../../api/formApi';

function SharedFormView() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      console.log('Loading form with ID:', formId);
      loadForm();
    } else {
      setError('Invalid form link');
      setLoading(false);
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      if (!formId) {
        throw new Error('Invalid form link');
      }
      
      const response = await getFormByShareableLink(formId);
      console.log('API Response:', response);

      if (!response) {
        throw new Error('Form not found');
      }

      setForm({
        title: response.formTitle || 'Untitled Form',
        headerImage: response.headerImage,
        fields: (response.questions || []).map(q => ({
          _id: q._id || q.id,
          label: q.question,
          type: q.type || 'text',
          required: Boolean(q.required),
          options: Array.isArray(q.options) ? q.options : [],
          section: q.section || ''
        }))
      });
    } catch (err) {
      console.error('Error loading form:', err);
      setError(err.message || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (fieldId, value) => {
    console.log('Input change:', fieldId, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData); // Debug log
      await submitFormResponse(formId, {
        formId,
        answers: Object.entries(formData).map(([fieldId, value]) => ({
          fieldId,
          value
        }))
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">Loading form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Form not found</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-green-500">Thank you for your submission!</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {form.headerImage && (
        <img 
          src={form.headerImage} 
          alt="Form header" 
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-2xl font-bold mb-6">{form.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field._id} className="form-field space-y-2">
            {field.section && (
              <div className="text-lg font-medium text-gray-900 mt-6 mb-4">
                {field.section}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                required={field.required}
                onChange={(e) => handleInputChange(field._id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            )}
            {field.type === 'select' && (
              <select
                required={field.required}
                onChange={(e) => handleInputChange(field._id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select an option</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button 
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SharedFormView;