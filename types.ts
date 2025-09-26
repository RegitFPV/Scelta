
export interface Photo {
  id: string;
  url: string;
  title: string;
}

export interface Vote {
  photoId: string;
  voterName: string;
}

export interface Comment {
  id: string;
  photoId: string;
  authorName: string;
  text: string;
  timestamp: number;
}
