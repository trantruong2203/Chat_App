import React, { useState, useContext } from 'react';
import { Layout, Alert } from 'antd';
import type { UploadFile } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import '../../App.css';
import { ContextAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../hooks';
import { getObjectById } from '../../services/respone';
import { usePostData } from '../../hooks/usePostData';
import { useFavorites } from '../../hooks/useFavorites';
import { useNewsData } from '../../hooks/useNewsData';
import { useContacts } from '../../hooks/useContacts';
import CreatPostModal from './CreatPostModal';
import PostDetailModal from '../../components/modal/PostCommentlModal';
import PostCard from '../../components/post/PostCard';
import NewsSidebar from '../../components/post/NewsSidebar';
import ContactsSidebar from '../../components/post/ContactsSidebar';
import CreatePostSection from '../../components/post/CreatePostSection';
import ErrorBoundary from '../../components/ErrorBoundary';
import { PostSkeleton } from '../../components/Loading';
import { toast } from 'react-toastify';
import type { Post as PostModel } from '../../interface/UserResponse';
import { useCommentCounts } from '../../hooks/useCommentCounts';

const { Content } = Layout;

const Post: React.FC = () => {
  // Basic state
  const [newPostContent, setNewPostContent] = useState('');
  const [open, setOpen] = useState(false);
  const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Get current user info
  const { accountLogin } = useContext(ContextAuth);
  const { items } = useAppSelector((state) => state.user);
  const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;

  // Custom hooks for data management
  const { contacts} = useContacts(currentUserId);
  const { allPosts, postImagesMap, loading: postsLoading, error: postsError } = usePostData(currentUserId, contacts);
  const { favoriteCounts, isFavorite, handleLike, isPostLoading} = useFavorites(currentUserId, allPosts.map(p => p.id));
  const { commentCounts, refreshPostCount } = useCommentCounts(allPosts.map(p => p.id));
  const { newsArticles, loading: newsLoading, error: newsError, refreshNews } = useNewsData();

  // Event handlers
  const handleOpenPostDetail = (post: PostModel) => {
    setSelectedPost(post);
    setPostDetailModalVisible(true);
  };

  const handleClosePostDetail = () => {
    setPostDetailModalVisible(false);
    setSelectedPost(null);
  };

  // Early return if no user logged in
  if (!currentUserId) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--yahoo-bg-secondary)' }}>
        <Content style={{ padding: '50px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--yahoo-text)' }}>Vui lòng đăng nhập để xem bài viết</h2>
        </Content>
      </Layout>
    );
  }

    const handleImageSelect = (info: UploadChangeParam<UploadFile>) => {
      const { fileList } = info;
      const validFiles = fileList.filter((file: UploadFile) => file.status !== 'error' && file.originFileObj instanceof File);

      setUploadFileList(validFiles);
      const validFileObjects = validFiles.map((file: UploadFile) => file.originFileObj as File);
      setSelectedImages(validFileObjects);

      const newPreviewImages: string[] = [];
      validFileObjects.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviewImages.push(e.target?.result as string);
          if (newPreviewImages.length === validFileObjects.length) {
            setPreviewImages([...newPreviewImages]);
          }
        };
        reader.onerror = () => {
          toast.error('Lỗi khi đọc file ảnh');
        };
        reader.readAsDataURL(file);
      });
      setOpen(true);
    };

  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--yahoo-bg-secondary)', overflow: 'scroll' }}>
        <Layout>
          {/* News Sidebar */}
          <ErrorBoundary fallback={<div style={{ width: 380, padding: 20, background: 'var(--yahoo-bg)' }}>Không thể tải tin tức</div>}>
            <NewsSidebar
              newsArticles={newsArticles}
              loading={newsLoading}
              error={newsError}
              onRefresh={refreshNews}
            />
          </ErrorBoundary>

          {/* Main Content */}
          <Layout style={{ padding: '24px', marginLeft: 380, marginRight: 300, marginTop: 0 }}>
            <Content>
              {/* Create Post Section */}
              <CreatePostSection
                users={items}
                currentUserId={currentUserId}
                onCreatePost={() => setOpen(true)}
                handleImageSelect={handleImageSelect}
                uploadFileList={uploadFileList}
              />

              {/* Posts List with Loading and Error States */}
              {postsLoading ? (
                <PostSkeleton />
              ) : postsError ? (
                <Alert
                  message="Lỗi tải bài viết"
                  description={postsError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 20, borderRadius: '8px' }}
                />
              ) : allPosts.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 0',
                  background: 'var(--yahoo-bg)',
                  borderRadius: '12px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ color: 'var(--yahoo-text)', marginBottom: '8px' }}>Chưa có bài viết nào</h3>
                  <p style={{ color: 'var(--yahoo-text-secondary)' }}>Hãy tạo bài viết đầu tiên của bạn!</p>
                </div>
              ) : (
                allPosts.map((post) => (
                  <ErrorBoundary key={post.id} fallback={<div style={{ background: 'var(--yahoo-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>Lỗi hiển thị bài viết</div>}>
                    <PostCard
                      post={post}
                      postImages={postImagesMap[post.id] || []}
                      users={items}
                      favoriteCounts={Object.fromEntries(
                        Object.entries(favoriteCounts).map(([key, value]) => [key, value ?? 0])
                      )}
                      isFavorite={isFavorite}
                      onLike={handleLike}
                      onComment={handleOpenPostDetail}
                      commentCount={commentCounts[post.id] || 0}
                      refreshPostCount={refreshPostCount}
                      isLikeLoading={isPostLoading(post.id)}
                    />
                  </ErrorBoundary>
                ))
              )}
            </Content>
          </Layout>

          {/* Contacts Sidebar */}
          <ErrorBoundary fallback={<div style={{ width: 300, padding: 20, background: 'var(--yahoo-bg)' }}>Không thể tải danh bạ</div>}>
            <ContactsSidebar
              contacts={contacts}
              users={items}
            />
          </ErrorBoundary>
        </Layout>

        {/* Modals */}
        <CreatPostModal
          open={open}
          setOpen={setOpen}
          setNewPostContent={setNewPostContent}
          newPostContent={newPostContent}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          uploadFileList={uploadFileList}
          setUploadFileList={setUploadFileList}
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
          handleImageSelect={handleImageSelect}
        />
        <PostDetailModal
          visible={postDetailModalVisible}
          onClose={handleClosePostDetail}
          post={selectedPost}
          postImages={selectedPost ? postImagesMap[selectedPost.id] || [] : []}
          favoriteCounts={Object.fromEntries(
            Object.entries(favoriteCounts).map(([key, value]) => [key, value ?? 0])
          )}
          handleLike={handleLike}
          isFavorite={isFavorite}
          currentUserId={currentUserId}
          isLikeLoading={selectedPost ? isPostLoading(selectedPost.id) : false}
          refreshPostCount={refreshPostCount}
          commentCounts={commentCounts}
        />
      </Layout>
    </ErrorBoundary>
  );
};

export default Post;
