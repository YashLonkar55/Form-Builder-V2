import React, { useState } from 'react';
import { XMarkIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const ShareModal = ({ isOpen, onClose, formId }) => {
  const [copied, setCopied] = useState(false);
  const shareableLink = `${window.location.origin}/shared-form/${formId}`;

  const handleCopy = async () => {
    if (!shareableLink) {
      alert('No valid form link available');
      return;
    }
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  if (!formId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Error</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-red-600">Please save the form first to get a share link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share Form</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Share this link with others:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="flex-1 p-2 border rounded-lg bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
              ) : (
                <ClipboardIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Anyone with this link can view and fill out this form.
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
