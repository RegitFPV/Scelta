
import React from 'react';
import type { Photo, Vote, Comment } from '../types';
import PhotoCard from './PhotoCard';

interface PhotoGridProps {
  photos: Photo[];
  votes: Vote[];
  comments: Comment[];
  isAdmin: boolean;
  onVote: (photoId: string, voterName: string) => boolean;
  onAddComment: (photoId: string, authorName: string, text: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {props.photos.map(photo => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          votes={props.votes}
          comments={props.comments}
          isAdmin={props.isAdmin}
          onVote={props.onVote}
          onAddComment={props.onAddComment}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
