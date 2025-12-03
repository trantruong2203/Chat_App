import React, { useEffect, useState } from 'react';
import {
  Modal,
  Avatar,
  Typography,
  Button,
  Divider,
  Spin,
  Empty,
  type UploadFile
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import {
  CommentOutlined,
  ShareAltOutlined,
  GlobalOutlined,
  MoreOutlined,
  LikeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../stores/store';
import { getObjectByEmail } from '../../services/respone';
import type { PostDetailModalProps, CommentFormData } from '../../interface/Comment';
import CommentList from '../post/comment/CommentList';
import dayjs from 'dayjs';
import './PostDetailModal.css';
import CommentForm from '../post/comment/CommentForm';
import { createdComment, getCommentsByPostId } from '../../features/comments/commentThunks';
import { buildCommentTree } from '../../utils/commentMapper';
import PostImages from '../post/PostImages';
import { uploadImageToCloudinary } from '../../config/CloudinaryConfig';
import { toast } from 'react-toastify';

const { Title, Text, Paragraph } = Typography;

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  visible,
  onClose,
  post,
  postImages,
  favoriteCounts,
  handleLike,
  isFavorite,
  currentUserId,
  isLikeLoading = false,
  refreshPostCount,
  commentCounts,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { items: comments } = useSelector((state: RootState) => state.comment);
  const { items } = useSelector((state: RootState) => state.user);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

  // Build comment tree from flat array
  const commentTree = buildCommentTree(comments);
  
  const postAuthor = post ? getObjectByEmail(items, post.userid) : null;
  
  // Format time function
  const formatTime = (dateString: string) => {
    const now = dayjs();
    const postDate = dayjs(dateString);
    const diffInHours = now.diff(postDate, 'hour');
    const diffInDays = now.diff(postDate, 'day');

    if (diffInDays >= 1) {
      return postDate.format('DD/MM/YYYY lúc HH:mm');
    } else if (diffInHours >= 1) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInMinutes = now.diff(postDate, 'minute');
      return `${diffInMinutes} phút trước`;
    }
  };

  useEffect(() => {
    if (post) {
      dispatch(getCommentsByPostId(post.id)).unwrap();
    }
  }, [post, dispatch]);

  const handleCommentSubmit = async (data: CommentFormData) => {
    if (!currentUserId || !post) return;
    
    setSubmitting(true);
    try {
      let imgurl = '';
      
      // Xử lý upload ảnh nếu có
      if (selectedImages.length > 0) {
        try {
          // Upload ảnh đầu tiên (có thể mở rộng để upload nhiều ảnh sau)
          const imageUrl = await uploadImageToCloudinary(selectedImages[0], 'comment_images');
          imgurl = imageUrl;
        } catch (uploadError) {
          console.error(`Lỗi khi upload ảnh:`, uploadError);
          toast.error('Lỗi khi upload ảnh. Vui lòng thử lại.');
          setSubmitting(false);
          return;
        }
      }
      
      const commentData = {
        userid: currentUserId,
        postid: post.id,
        content: data.content.trim(),
        iconid: 0,
        imgurl: imgurl,
        commentid: data.commentid || undefined,
        createdat: data.createdat,
      };
      
      // Tạo comment
      await dispatch(createdComment(commentData));
      
      // Lấy lại danh sách comment để cập nhật UI
      await dispatch(getCommentsByPostId(post.id)).unwrap();
      
      // Reset form sau khi thành công
      setSelectedImages([]);
      setPreviewImages([]);
      setUploadFileList([]);
      setSubmitting(false);
      refreshPostCount(post.id);
      
      toast.success('Bình luận đã được gửi thành công!');
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentReply = async (commentId: number, content: string) => {
    if (!post || !currentUserId) return;
    
    // Tạo dữ liệu comment reply
    const replyData: CommentFormData = {
      id: 0,
      userid: currentUserId,
      postid: post.id,
      content: content.trim(),
      createdat: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      iconid: 0,
      imgurl: '',
      commentid: commentId 
    };
        await handleCommentSubmit(replyData);
  };

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
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    const newUploadFileList = uploadFileList.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviewImages(newPreviewImages);
    setUploadFileList(newUploadFileList);
  };
  
  if (!post) return null;

  return (
    <Modal
      title={`Bài viết của ${postAuthor?.username}`}
      open={visible}
      onCancel={onClose}
      footer={null} 
      width="90%"
      style={{ maxWidth: '800px' }}
      className="post-detail-modal"
      styles={{
        
          body: { padding: 0, maxHeight: 'calc(90vh - 120px)' },
          header: { textAlign: 'center', fontSize: '18px', fontWeight: 'bold', padding: '16px 20px' },
        }}
    >
      <div className="post-detail-content">
        {/* Post Header */}
        <div className="post-header">
          <div className="post-author-info">
            <Avatar
              src={postAuthor?.avatar}
              size={48}
              className="post-author-avatar"
            />
            <div className="post-meta">
              <Title level={5} className="post-author-name">
                {postAuthor?.username || 'Người dùng'}
              </Title>
              <Text type="secondary" className="post-time">
                {formatTime(post.createdat)} · <GlobalOutlined />
              </Text>
            </div>
          </div>
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined />}
            className="post-more-btn"
          />
        </div>

        {/* Post Content */}
        <div className="post-content">
          <Paragraph className="post-text">
            {post.content}
          </Paragraph>
          
          {postImages && postImages.length > 0 && (
           <PostImages images={postImages} />
          )}
        </div>

        {/* Post Stats */}
        <div className="post-stats">
          <div className="post-stats-left">
          <Text type="secondary">
          <LikeOutlined style={{ color: isFavorite(post.id) ? '#1877f2' : 'inherit' }} /> {favoriteCounts[post.id] || 0}
        </Text>
          </div>
          <div className="post-stats-right">
            <Text type="secondary">
              {commentCounts[post.id] || 0} bình luận · {post.shares || 0} lượt chia sẻ
            </Text>
          </div>
        </div>

        <Divider className="post-divider" />

        {/* Action Buttons */}
        <div className="post-actions">
        <Button
          type="text"
          icon={isLikeLoading ? <LoadingOutlined /> : <LikeOutlined />}
          style={{
            flex: 1,
            color: isFavorite(post.id) ? '#1877f2' : 'inherit',
            fontWeight: isFavorite(post.id) ? 'bold' : 'normal'
          }}
          onClick={() => handleLike(post.id)}
          loading={isLikeLoading}
          disabled={isLikeLoading}
        >
          Thích
        </Button>
          <Button
            type="text"
            icon={<CommentOutlined />}
            className="action-btn comment-btn"
          >
            Bình luận
          </Button>
          <Button
            type="text"
            icon={<ShareAltOutlined />}
            className="action-btn share-btn"
          >
            Chia sẻ
          </Button>
        </div>

        <Divider className="post-divider" />

        {/* Comments Section */}
        <div className="comments-section">
          <div className="comments-header">
            <Title level={5}>Bình luận ({commentCounts[post.id] || 0})</Title>
          </div>

           {/* Comment Form */}
           <div className="comment-form-container">
            <CommentForm
              parentId={undefined}
              placeholder="Viết bình luận..."
              onCancel={() => {}}
              loading={submitting}
              compact={false}
              autoFocus={false}
              handleImageSelect={handleImageSelect}
              handleRemoveImage={handleRemoveImage}
              previewImages={previewImages}
              selectedImages={selectedImages}
              uploadFileList={uploadFileList}
              handleCommentSubmit={(data) => {
                // Cập nhật postid từ post hiện tại
                const updatedData = {
                  ...data,
                  postid: post.id
                };
                handleCommentSubmit(updatedData);
              }}
            />
          </div>

          {/* Comments List */}
          <div className="comments-list-container">
            {submitting ? (
              <div className="comments-loading">
                <Spin size="large" />
                <Text>Đang tải bình luận...</Text>
              </div>
            ) : commentTree.length > 0 ? (
              <CommentList
                comments={commentTree}
                items={items}
                currentUserId={currentUserId}
                handleCommentReply={handleCommentReply}
                handleImageSelect={handleImageSelect}
                handleRemoveImage={handleRemoveImage}
                previewImages={previewImages}
                selectedImages={selectedImages}
                uploadFileList={uploadFileList}
              />
            ) : (
              <Empty
                description="Chưa có bình luận nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailModal;
