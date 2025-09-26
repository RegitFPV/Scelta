import React, { useState } from 'react';
import type { Photo, Vote, Comment } from './types';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PhotoGrid from './components/PhotoGrid';
import VotingChart from './components/VotingChart';
import AdminPanel from './components/AdminPanel';

// Initial dummy data
const initialPhotos: Photo[] = [
  { id: '1', url: 'https://picsum.photos/id/1018/800/600', title: 'Mountain Valley' },
  { id: '2', url: 'https://picsum.photos/id/1015/800/600', title: 'Winding River' },
  { id: '3', url: 'https://picsum.photos/id/1025/800/600', title: 'Loyal Companion' },
  { id: '4', url: 'https://picsum.photos/id/1040/800/600', title: 'Misty Forest' },
];

const App: React.FC = () => {
  const [appTitle, setAppTitle] = useState('PhotoVote');
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
            <AdminPanel 
                appTitle={appTitle}
                photos={photos} 
                votes={votes} 
                onAddPhoto={handleAddPhoto} 
                onDeletePhoto={handleDeletePhoto} 
                onUpdateTitle={handleUpdateTitle}
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
        />
      </main>

      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {appTitle}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;