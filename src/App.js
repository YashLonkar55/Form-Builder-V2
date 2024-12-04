import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormPreview from './components/FormPreview/FormPreview';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<FormBuilder />} />
					<Route path="/preview/:id" element={<FormPreview />} />
				</Routes>
			</BrowserRouter>
		</ErrorBoundary>
	);
}

export default App;
