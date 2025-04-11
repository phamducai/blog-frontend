import { User } from './auth.dto';
import { Comment } from './comment.dto';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  users?: {
    id: string;
    email: string;
  };
  _count: {
    comments: number;
  };
  comments?: Comment[];
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface PostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

export type PostsResponse = Post[]; 
