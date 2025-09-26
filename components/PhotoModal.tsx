import React from 'react';
import type { Photo } from '../types';
import { CloseIcon } from './icons';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-xl p-4 relative max-w-4xl w-full transform transition-all duration-300 scale-95"
        // Prevent closing when clicking on the modal content itself
        onClick={(e) => e.stopPropagation()} 
        style={{ animation: 'zoomIn 0.3s ease-out forwards' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-slate-800/50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500"
          aria-label="Close image view"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="w-full max-h-[80vh] flex items-center justify-center">
             <img src={photo.url} alt={photo.title} className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-md" />
        </div>
        <h3 className="text-center text-lg font-bold mt-3 text-slate-100">{photo.title}</h3>
      </div>
      <style>{`
        @keyframes zoomIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;
