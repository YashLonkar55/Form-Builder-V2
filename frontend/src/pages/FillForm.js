import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FillForm = () => {
	const { shareId } = useParams();
	const navigate = useNavigate();
	const [form, setForm] = useState(null);
	const [answers, setAnswers] = useState({});
	const [respondent, setRespondent] = useState({ name: '', email: '' });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchForm = async () => {
			try {
				const response = await axios.get(`/api/forms/shared/${shareId}`);
				setForm(response.data);
				setLoading(false);
			} catch (err) {
				setError('Form not found or no longer available');
				setLoading(false);
			}
		};
		fetchForm();
	}, [shareId]);

	const handleAnswerChange = (questionId, value, type) => {
		setAnswers(prev => ({
			...prev,
			[questionId]: { value, type }
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formattedAnswers = Object.entries(answers).map(([questionId, data]) => ({
				questionId,
				type: data.type,
				answer: data.value
			}));

			await axios.post(`/api/form-responses/submit/${shareId}`, {
				respondent,
				answers: formattedAnswers
			});

			navigate('/thank-you');
		} catch (err) {
			setError(err.response?.data?.message || 'Error submitting form');
		}
	};

	if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
	if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
	if (!form) return <div className="text-center p-4">Form not found</div>;

	return (
		<div className="max-w-3xl mx-auto p-4">
			<div className="bg-white shadow-lg rounded-lg p-6">
				<h1 className="text-2xl font-bold mb-4">{form.formTitle}</h1>
				{form.headerImage && (
					<img src={form.headerImage} alt="Form header" className="w-full mb-4 rounded" />
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{form.shareSettings?.collectEmail && (
						<div className="space-y-4">
							<input
								type="text"
								placeholder="Your Name"
								className="w-full p-2 border rounded"
								value={respondent.name}
								onChange={(e) => setRespondent(prev => ({ ...prev, name: e.target.value }))}
								required
							/>
							<input
								type="email"
								placeholder="Your Email"
								className="w-full p-2 border rounded"
								value={respondent.email}
								onChange={(e) => setRespondent(prev => ({ ...prev, email: e.target.value }))}
								required
							/>
						</div>
					)}

					{form.questions.map((question, index) => (
						<div key={question._id} className="p-4 border rounded">
							<div className="font-medium mb-2">
								{index + 1}. {question.question}
							</div>
							{question.image && (
								<img src={question.image} alt="Question" className="mb-2 max-w-full h-auto" />
							)}
							
							{/* Render different input types based on question type */}
							{renderQuestionInput(question, handleAnswerChange)}
						</div>
					))}

					<button
						type="submit"
						className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

// Helper function to render appropriate input based on question type
const renderQuestionInput = (question, onChange) => {
	switch (question.type) {
		case 'text':
			return (
				<input
					type="text"
					className="w-full p-2 border rounded"
					onChange={(e) => onChange(question._id, e.target.value, 'text')}
					required
				/>
			);
		case 'multiple-choice':
			return (
				<div className="space-y-2">
					{question.options.map((option, idx) => (
						<label key={idx} className="flex items-center">
							<input
								type="radio"
								name={question._id}
								value={option}
								onChange={(e) => onChange(question._id, e.target.value, 'multiple-choice')}
								required
								className="mr-2"
							/>
							{option}
						</label>
					))}
				</div>
			);
		// Add other question types as needed
		default:
			return <div>Unsupported question type</div>;
	}
};

export default FillForm;