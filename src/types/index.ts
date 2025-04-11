import { User } from '@/lib/dto/auth.dto';

// Common interfaces
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  users: {
    id: string;
    email: string;
  };
  comments?: Comment[];
  _count: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  users?: {
    id: string;
    email: string;
  };
}

// Auth interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Component Props interfaces
export interface CommentsProps {
  postId: string;
  commentCount: number;
  user: User | null;
  onUpdate: (comments: Comment[], count: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
} 


export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 