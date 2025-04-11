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

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponse {
  data: Comment;
  message: string;
}

export interface CommentsResponse {
  data: Comment[];
  message: string;
} 