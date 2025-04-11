import { useState } from 'react';
import { postsApi } from '@/lib/posts';
import { Comment } from '@/lib/dto/comment.dto';

interface UseCommentsProps {
  postId: string;
  onUpdate: (comments: Comment[], count: number) => void;
  initialComments: Comment[];
}

export const useComments = ({ postId, onUpdate, initialComments }: UseCommentsProps) => {
  const [commentText, setCommentText] = useState('');
  const [editCommentText, setEditCommentText] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading({ ...loading, fetch: true });
      setError(null);
      const comments = await postsApi.getComments(postId);
      setComments(comments);
      onUpdate(comments, comments.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading({ ...loading, fetch: false });
    }
  };

  const toggleComments = async () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    if (newExpandedState) {
      await fetchComments();
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setLoading({ ...loading, add: true });
    try {
      const newComment = await postsApi.addComment(postId, commentText);
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      onUpdate(updatedComments, updatedComments.length);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading({ ...loading, add: false });
    }
  };

  const handleEditComment = async (commentId: string) => {
    const content = editCommentText[commentId];
    if (!content?.trim()) return;

    setLoading({ ...loading, [`edit-${commentId}`]: true });
    try {
      const updatedComment = await postsApi.updateComment(postId, commentId, content);
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? updatedComment : comment
      );
      setComments(updatedComments);
      onUpdate(updatedComments, updatedComments.length);
      setEditingComment({ ...editingComment, [commentId]: false });
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment');
    } finally {
      setLoading({ ...loading, [`edit-${commentId}`]: false });
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    setLoading({ ...loading, [`delete-${commentToDelete}`]: true });
    try {
      await postsApi.deleteComment(commentToDelete, postId);
      const updatedComments = comments.filter(comment => comment.id !== commentToDelete);
      setComments(updatedComments);
      onUpdate(updatedComments, updatedComments.length);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    } finally {
      setLoading({ ...loading, [`delete-${commentToDelete}`]: false });
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  };

  const startEditingComment = (comment: Comment) => {
    setEditCommentText({ ...editCommentText, [comment.id]: comment.content });
    setEditingComment({ ...editingComment, [comment.id]: true });
  };

  return {
    commentText,
    setCommentText,
    editCommentText,
    setEditCommentText,
    editingComment,
    setEditingComment,
    loading,
    expanded,
    deleteModalOpen,
    setDeleteModalOpen,
    handleAddComment,
    handleEditComment,
    handleDeleteClick,
    handleConfirmDelete,
    startEditingComment,
    toggleComments,
    comments,
    error
  };
}; 