import axios from "axios";
const API_BASE_URL = 'http://localhost:5000/api/forms';

export const saveForm = async (formData) => {
  try {
    const response = await axios.post(API_BASE_URL, formData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save form';
    throw new Error(errorMessage);
  }
};

export const createShareableLink = async (formId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${formId}`);
    return { shareableLink: formId };
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw new Error(error.response?.data?.message || 'Failed to create shareable link');
  }
};

export const getFormByShareableLink = async (formId) => {
  try {
    console.log('Fetching form with ID:', formId);
    // Update endpoint to match backend API structure
    const response = await axios.get(`${API_BASE_URL}/${formId}`);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    console.log('API Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getFormByShareableLink:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw error;
    }
  }
};


export const submitFormResponse = async (formId, responseData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${formId}/responses`, {
      ...responseData,
      submittedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit form response');
  }
};


