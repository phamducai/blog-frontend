'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/dto/post.dto';
import { postsApi } from '@/lib/posts';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/hooks/useAuth';
import { Modal } from '@/components/Modal';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState<Record<string, boolean>>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null; postTitle: string }>({
    isOpen: false,
    postId: null,
    postTitle: '',
  });

  useEffect(() => {
    if (!authLoading) {
      fetchPosts();
    }
  }, [authLoading]);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await postsApi.getAll();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const postToDelete = posts.find(post => post.id === postId);
    if (!postToDelete) return;

    setDeleteModal({
      isOpen: true,
      postId,
      postTitle: postToDelete.title,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.postId) return;

    setDeletingPost({ ...deletingPost, [deleteModal.postId]: true });
    try {
      await postsApi.delete(deleteModal.postId);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeletingPost({ ...deletingPost, [deleteModal.postId]: false });
      setDeleteModal({ isOpen: false, postId: null, postTitle: '' });
    }
  };

  if (authLoading || loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Posts</h2>
            {posts.length > 0 ? (
              <div>
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onDelete={handleDeletePost} 
                    user={user} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-600">No posts yet. Be the first to create one!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null, postTitle: '' })}
        onConfirm={confirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteModal.postTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
} 