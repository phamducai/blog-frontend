'use client';

import { useRouter } from 'next/navigation';
import { User } from '@/lib/dto/auth.dto';
import { Post } from '@/lib/dto/post.dto';
import { Comments } from './Comments';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  user: User | null;
  showComments?: boolean;
}

export const PostCard = ({ post, onDelete, user, showComments = true }: PostCardProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
        {user && user.id === post.authorId && (
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/posts/edit/${post.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Posted by {post.users?.email || 'Anonymous'}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      {showComments && (
        <div className="mt-4">
          <Comments 
            postId={post.id} 
            commentCount={post.comments?.length || 0}
            user={user}
          />
        </div>
      )}
    </div>
  );
}; 