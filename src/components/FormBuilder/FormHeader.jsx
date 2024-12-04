import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

const FormHeader = ({ formTitle, setFormTitle, headerImage, onImageUpload }) => {
  return (
    <div className="bg-white rounded-t-lg border border-gray-200">
      {headerImage && (
        <div className="h-40 w-full overflow-hidden">
          <img src={headerImage} alt="Form header" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 border-l-8 border-purple-600">
        <div className="flex justify-between items-start">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-3xl font-normal w-full focus:outline-none focus:border-b-2 focus:border-purple-600"
            placeholder="Untitled form"
          />
          <label className="cursor-pointer">
            <PhotoIcon className="h-6 w-6 text-gray-500 hover:text-purple-600" />
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="h-1 w-full bg-purple-600 mt-4"></div>
      </div>
    </div>
  );
};

export default FormHeader;