import { useState } from 'react';
import { Modal } from './Modal';
import { Comment } from '@/lib/dto/comment.dto';
import { User } from '@/lib/dto/auth.dto';
import { postsApi } from '@/lib/posts';

interface CommentsProps {
  postId: string;
  commentCount: number;
  user: User | null;
}

export const Comments = ({ postId, commentCount, user }: CommentsProps) => {
  const [commentText, setCommentText] = useState('');
  const [editCommentText, setEditCommentText] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading({ ...loading, fetch: true });
      setError(null);
      const fetchedComments = await postsApi.getComments(postId);
      setComments(fetchedComments);
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
      await postsApi.addComment(postId, commentText);
      setCommentText('');
      await fetchComments();
    } catch (error) {
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
      await postsApi.updateComment(postId, commentId, content);
      setEditingComment({ ...editingComment, [commentId]: false });
      await fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment');
    } finally {
      setLoading({ ...loading, [`edit-${commentId}`]: false });
    }
  };

  const handleDeleteClick = ( commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
  
    setLoading({ ...loading, [`delete-${commentToDelete}`]: true });
    try {
      await postsApi.deleteComment(postId, commentToDelete);
      await fetchComments();
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

  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">
          Comments
        </h4>
        <button
          onClick={toggleComments}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          {expanded ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      
      {expanded && (
        <>
          {/* Comment Form */}
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={2}
              placeholder="Write a comment..."
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={loading.add}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm transition disabled:opacity-50"
              >
                {loading.add ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
          
          {/* Comments List */}
          {loading.fetch ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  {editingComment[comment.id] ? (
                    <div>
                      <textarea
                        value={editCommentText[comment.id] || ''}
                        onChange={(e) => setEditCommentText({ ...editCommentText, [comment.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        rows={2}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingComment({ ...editingComment, [comment.id]: false })}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          disabled={loading[`edit-${comment.id}`]}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition disabled:opacity-50"
                        >
                          {loading[`edit-${comment.id}`] ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700">{comment.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                        <span>{comment.users?.email || 'Anonymous'}</span>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          {user && user.id === comment.authorId && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditingComment(comment)}
                                className="text-blue-500 hover:text-blue-700 transition"
                                title="Edit comment"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(comment.id)}
                                disabled={loading[`delete-${comment.id}`]}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Delete comment"
                              >
                                {loading[`delete-${comment.id}`] ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
          )}
        </>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}; 