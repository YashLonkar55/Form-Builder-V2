import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = {
	createForm: async (formData) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/forms`, formData);
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Error creating form');
		}
	},

	getForm: async (formId) => {
		try {
			const response = await axios.get(`${API_BASE_URL}/forms/${formId}`);
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Error fetching form');
		}
	}
};

export default api;
