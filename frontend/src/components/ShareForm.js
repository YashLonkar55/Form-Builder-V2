import React, { useState } from 'react';
import axios from 'axios';

const ShareForm = ({ formId, shareId, isShareable, shareSettings, onUpdate }) => {
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState(shareSettings || {
		allowAnonymous: false,
		collectEmail: true,
		submitOnce: true,
		expiresAt: null
	});
	const shareUrl = `${window.location.origin}/fill/${shareId}`;

	const handleToggleShare = async () => {
		try {
			const response = await axios.patch(`/api/forms/${formId}/share`, {
				isShareable: !isShareable
			});
			onUpdate(response.data);
		} catch (error) {
			console.error('Error toggling share status:', error);
		}
	};

	const handleSettingsUpdate = async () => {
		try {
			const response = await axios.patch(`/api/forms/${formId}/share-settings`, settings);
			onUpdate(response.data);
			setShowSettings(false);
		} catch (error) {
			console.error('Error updating share settings:', error);
		}
	};

	const copyShareLink = () => {
		navigator.clipboard.writeText(shareUrl);
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">Share Form</h2>
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={isShareable}
						onChange={handleToggleShare}
						className="sr-only peer"
					/>
					  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
				</label>
			</div>

			{isShareable && (
				<>
					<div className="flex items-center gap-2 mb-4">
						<input
							type="text"
							value={shareUrl}
							readOnly
							className="flex-1 p-2 border rounded"
						/>
						<button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Copy Link
						</button>
					</div>

					<button
						onClick={() => setShowSettings(!showSettings)}
						className="text-blue-500 hover:text-blue-600"
					>
						{showSettings ? 'Hide Settings' : 'Show Settings'}
					</button>

					{showSettings && (
						<div className="mt-4 space-y-3">
							<div>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={settings.allowAnonymous}
										onChange={(e) => setSettings(prev => ({
											...prev,
											allowAnonymous: e.target.checked
										}))}
										className="mr-2"
									/>
									Allow anonymous responses
								</label>
							</div>
							<div>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={settings.collectEmail}
										onChange={(e) => setSettings(prev => ({
											...prev,
											collectEmail: e.target.checked
										}))}
										className="mr-2"
									/>
									Collect email addresses
								</label>
							</div>
							<div>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={settings.submitOnce}
										onChange={(e) => setSettings(prev => ({
											...prev,
											submitOnce: e.target.checked
										}))}
										className="mr-2"
									/>
									Limit to one response
								</label>
							</div>
							<div>
								<label className="block mb-1">Form Expiry:</label>
								<input
									type="datetime-local"
									value={settings.expiresAt ? new Date(settings.expiresAt).toISOString().slice(0, 16) : ''}
									onChange={(e) => setSettings(prev => ({
										...prev,
										expiresAt: e.target.value ? new Date(e.target.value) : null
									}))}
									className="w-full p-2 border rounded"
								/>
							</div>
							<button
								onClick={handleSettingsUpdate}
								className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Save Settings
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ShareForm;