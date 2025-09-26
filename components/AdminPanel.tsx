import React, { useState, useEffect } from 'react';
import type { Photo, Vote } from '../types';
import { DeleteIcon, UploadIcon } from './icons';

interface AdminPanelProps {
  appTitle: string;
  photos: Photo[];
  votes: Vote[];
  onAddPhoto: (title: string, dataUrl: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onUpdateTitle: (newTitle: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ appTitle, photos, votes, onAddPhoto, onDeletePhoto, onUpdateTitle }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [newAppTitle, setNewAppTitle] = useState(appTitle);

  useEffect(() => {
    setNewAppTitle(appTitle);
  }, [appTitle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && file && preview) {
      onAddPhoto(title, preview);
      setTitle('');
      setFile(null);
      setPreview(null);
      (e.target as HTMLFormElement).reset();
    } else {
      alert('Please provide a title and select a file.');
    }
  };
  
  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTitle(newAppTitle);
  };

  const handleDelete = (photoId: string, photoTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the photo "${photoTitle}"?`)) {
        onDeletePhoto(photoId);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 my-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-300 border-b border-slate-700 pb-2">Admin Dashboard</h2>
      
      {/* App Settings */}
      <div className="bg-slate-900/50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">App Settings</h3>
          <form onSubmit={handleTitleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-grow w-full">
                  <label htmlFor="appTitle" className="block text-sm font-medium text-slate-400 mb-1">Application Title</label>
                  <input
                      id="appTitle"
                      type="text"
                      value={newAppTitle}
                      onChange={(e) => setNewAppTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
              </div>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors">
                  Save Title
              </button>
          </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Photo Form */}
        <div className="bg-slate-900/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">Add New Photo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="photoTitle" className="block text-sm font-medium text-slate-400 mb-1">Photo Title</label>
              <input
                id="photoTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Sunset Over The Lake"
              />
            </div>
            <div>
              <label htmlFor="photoFile" className="block text-sm font-medium text-slate-400 mb-1">Photo File</label>
              <input
                id="photoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
              />
            </div>
            {preview && <img src={preview} alt="Preview" className="mt-4 rounded-md max-h-40" />}
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
              <UploadIcon className="w-5 h-5" /> Add Photo
            </button>
          </form>
        </div>

        {/* Voting Details */}
        <div className="bg-slate-900/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">Voting Details</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {photos.map(photo => {
              const photoVotes = votes.filter(v => v.photoId === photo.id);
              return (
                <div key={photo.id} className="bg-slate-800 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-200">{photo.title}</p>
                      <p className="text-sm text-teal-400">{photoVotes.length} vote(s)</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {photoVotes.length > 0 ? `Voters: ${photoVotes.map(v => v.voterName).join(', ')}` : 'No voters yet.'}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(photo.id, photo.title)} className="text-red-500 hover:text-red-400">
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;