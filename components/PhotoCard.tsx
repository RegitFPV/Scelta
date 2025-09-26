import React, { useState } from 'react';
import type { Photo, Vote, Comment } from '../types';
import { VoteIcon, CommentIcon } from './icons';

interface PhotoCardProps {
  photo: Photo;
  votes: Vote[];
  comments: Comment[];
  isAdmin: boolean;
  onVote: (photoId: string, voterName: string) => boolean;
  onAddComment: (photoId: string, authorName: string, text: string) => void;
  onPhotoClick: (photo: Photo) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, votes, comments, isAdmin, onVote, onAddComment, onPhotoClick }) => {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const photoVotes = votes.filter(v => v.photoId === photo.id);
  const photoComments = comments.filter(c => c.photoId === photo.id).sort((a, b) => b.timestamp - a.timestamp);

  const handleVoteClick = () => {
    const voterName = prompt("Please enter your name to vote:");
    if (voterName && voterName.trim() !== '') {
      const success = onVote(photo.id, voterName.trim());
      if (success) {
        alert('Thank you for your vote!');
      } else {
        alert('You have already voted for this photo.');
      }
    } else if (voterName !== null) {
      alert('Name cannot be empty.');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && commentAuthor.trim()) {
      onAddComment(photo.id, commentAuthor.trim(), commentText.trim());
      setCommentText('');
      setCommentAuthor('');
    } else {
      alert('Please provide both your name and a comment.');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <div 
        className="w-full h-64 bg-black flex items-center justify-center cursor-pointer"
        onClick={() => onPhotoClick(photo)}
      >
        <img src={photo.url} alt={photo.title} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-slate-100">{photo.title}</h3>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <VoteIcon className="w-5 h-5" />
            <span>{isAdmin ? `${photoVotes.length} Votes` : 'Votes'}</span>
          </div>
          <button 
            onClick={handleVoteClick}
            className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors"
          >
            Vote
          </button>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={() => setShowComments(!showComments)} className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1">
          <CommentIcon className="w-4 h-4" />
          {showComments ? 'Hide' : 'Show'} Comments ({photoComments.length})
        </button>
        {showComments && (
          <div className="mt-4 space-y-4">
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
              <button type="submit" className="w-full px-3 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors">
                Post Comment
              </button>
            </form>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
              {photoComments.length > 0 ? photoComments.map(comment => (
                <div key={comment.id} className="bg-slate-700/50 p-2 rounded-md">
                  <p className="text-xs text-slate-300"><strong className="text-teal-400">{comment.authorName}</strong>: {comment.text}</p>
                </div>
              )) : <p className="text-xs text-slate-500">No comments yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;