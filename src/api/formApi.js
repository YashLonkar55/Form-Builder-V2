import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/forms'; // Update this with your actual backend server URL

export const saveForm = async (formData) => {
	try {
		const response = await axios.post(API_BASE_URL, formData);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || 'Failed to save form';
		throw new Error(errorMessage);
	}
};

export const getForm = async (formId) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/${formId}`);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch form';
		throw new Error(errorMessage);
	}
};