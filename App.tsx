import React, { useState } from 'react';
import type { Photo, Vote, Comment } from './types';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PhotoGrid from './components/PhotoGrid';
import VotingChart from './components/VotingChart';
import AdminPanel from './components/AdminPanel';
import PhotoModal from './components/PhotoModal';

// Initial dummy data, used only if localStorage is empty
const initialPhotos: Photo[] = [
  { id: '1', url: 'https://picsum.photos/id/1018/800/600', title: 'Mountain Valley' },
  { id: '2', url: 'https://picsum.photos/id/1015/800/600', title: 'Winding River' },
  { id: '3', url: 'https://picsum.photos/id/1025/800/600', title: 'Loyal Companion' },
  { id: '4', url: 'https://picsum.photos/id/1040/800/600', title: 'Misty Forest' },
];

const App: React.FC = () => {
    
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage`, error);
      return fallback;
    }
  };

  const [appTitle, setAppTitle] = useState<string>(() => loadFromStorage('photo-vote-title', 'PhotoVote'));
  const [photos, setPhotos] = useState<Photo[]>(() => loadFromStorage('photo-vote-photos', initialPhotos));
  const [votes, setVotes] = useState<Vote[]>(() => loadFromStorage('photo-vote-votes', []));
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage('photo-vote-comments', []));
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const ADMIN_PASS = '0907782512';

  const handleAdminClick = () => {
    setShowLogin(true);
    setLoginError(null);
  };

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASS) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError(null);
    } else {
      setLoginError('Invalid password.');
    }
  };
  
  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleVote = (photoId: string, voterName: string): boolean => {
    const hasVoted = votes.some(
      vote => vote.photoId === photoId && vote.voterName.toLowerCase() === voterName.toLowerCase()
    );
    if (hasVoted) {
      return false;
    }
    setVotes(prevVotes => [...prevVotes, { photoId, voterName }]);
    return true;
  };

  const handleAddComment = (photoId: string, authorName: string, text: string) => {
    const newComment: Comment = {
      id: new Date().toISOString(),
      photoId,
      authorName,
      text,
      timestamp: Date.now()
    };
    setComments(prevComments => [...prevComments, newComment]);
  };
  
  const handleAddPhoto = (title: string, dataUrl: string) => {
      const newPhoto: Photo = {
          id: new Date().toISOString(),
          title,
          url: dataUrl
      };
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
  };

  const handleDeletePhoto = (photoId: string) => {
      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
      setVotes(prevVotes => prevVotes.filter(v => v.photoId !== photoId));
      setComments(prevComments => prevComments.filter(c => c.photoId !== photoId));
  };
  
  const handleUpdateTitle = (newTitle: string) => {
    if (newTitle.trim()) {
        setAppTitle(newTitle.trim());
    }
  };
  
  const handleSaveChanges = () => {
    try {
        localStorage.setItem('photo-vote-title', JSON.stringify(appTitle));
        localStorage.setItem('photo-vote-photos', JSON.stringify(photos));
        localStorage.setItem('photo-vote-votes', JSON.stringify(votes));
        localStorage.setItem('photo-vote-comments', JSON.stringify(comments));
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Failed to save changes to localStorage', error);
        let errorMessage = 'Error: Could not save changes.';
        // Check for QuotaExceededError which happens when localStorage is full
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
            errorMessage = 'Error: Could not save changes. The browser\'s local storage is full. Please try removing some photos before adding new ones.';
        }
        alert(errorMessage);
    }
  };
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };


  return (
    <div className="min-h-screen bg-slate-900">
      <Header appTitle={appTitle} isAdmin={isAdmin} onAdminClick={handleAdminClick} onLogout={handleLogout} />
      
      {showLogin && (
        <LoginModal 
          onLogin={handleLogin} 
          onClose={() => setShowLogin(false)} 
          error={loginError}
        />
      )}

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
            <AdminPanel 
                appTitle={appTitle}
                photos={photos} 
                votes={votes} 
                onAddPhoto={handleAddPhoto} 
                onDeletePhoto={handleDeletePhoto} 
                onUpdateTitle={handleUpdateTitle}
                onSaveChanges={handleSaveChanges}
            />
        )}
        
        <VotingChart photos={photos} votes={votes} />
        
        <PhotoGrid
          photos={photos}
          votes={votes}
          comments={comments}
          isAdmin={isAdmin}
          onVote={handleVote}
          onAddComment={handleAddComment}
          onPhotoClick={handlePhotoClick}
        />
      </main>

      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {appTitle}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;