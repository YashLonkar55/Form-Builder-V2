import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormPreview from './components/FormPreview/FormPreview';
import './App.css';
import SharedFormView from './components/SharedForm/SharedFormView';
import ShareForm from './components/SharedForm/ShareForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/preview" element={<FormPreview />} />
        <Route path="/form/:formId/edit" element={<FormBuilder />} />
        <Route path="/form/:formId/share" element={<ShareForm />} />
        <Route path="/shared-form/:formId" element={<SharedFormView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
