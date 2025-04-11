import { PostResponse, PostsResponse, CreatePostDto, UpdatePostDto ,Post} from '@/lib/dto/post.dto';
import { CommentResponse, Comment, CreateCommentDto, UpdateCommentDto } from '@/lib/dto/comment.dto';
import { http, handleResponse } from '@/lib/http';

export const postsApi = {
  // Get all posts
  getAll: () => {
    return handleResponse<PostsResponse>(http.get('/posts'));
  },

  // Get a post by ID
  getById: (postId: string) => {
    return handleResponse<Post>(http.get(`/posts/${postId}`));
  },

  // Create a new post
  create: (postData: CreatePostDto) => {
    return handleResponse<PostResponse>(http.post('/posts', postData));
  },

  // Update a post
  update: (postId: string, postData: UpdatePostDto) => {
    return handleResponse<PostResponse>(http.put(`/posts/${postId}`, postData));
  },

  // Delete a post
  delete: (postId: string) => {
    console.log(postId);
    return handleResponse<void>(http.delete(`/posts/${postId}`));
  },

  // Get comments for a post
  getComments: (postId: string) => {
    return handleResponse<Comment[]>(http.get(`/posts/${postId}/comments`));
  },

  // Add a comment to a post
  addComment: (postId: string, content: string) => {
    const commentData: CreateCommentDto = { content };
    return handleResponse<Comment>(http.post(`/posts/${postId}/comments`, commentData));
  },

  // Update a comment
  updateComment: (postId: string, commentId: string, content: string) => {
    const commentData: UpdateCommentDto = { content };
    return handleResponse<Comment>(http.patch(`/posts/${postId}/comments/${commentId}`, commentData));
  },

  // Delete a comment
  deleteComment: (postId: string, commentId: string) => {
    console.log(postId, commentId);
    return handleResponse<void>(http.delete(`/posts/${postId}/comments/${commentId}`));
  },

  // Get comment count for a post
  getCommentCount: (postId: string) => {
    return handleResponse<{ count: number }>(http.get(`/posts/${postId}/comments/count`));
  },
}; 