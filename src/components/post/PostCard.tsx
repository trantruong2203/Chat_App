import React from 'react';
import {
  Avatar,
  Button,
  Card,
  Typography,
  Tooltip,
} from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  MoreOutlined,
  GlobalOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { PostUI } from '../../hooks/usePostData';
import { getObjectByEmail } from '../../services/respone';
import type { UserResponse } from '../../interface/UserResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import PostImages from './PostImages';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text, Paragraph } = Typography;

// Time formatting function
const formatTime = (dateString: string) => {
  const now = dayjs();
  const postDate = dayjs(dateString);
  const diffInHours = now.diff(postDate, 'hour');
  const diffInDays = now.diff(postDate, 'day');

  if (diffInDays >= 1) {
    return postDate.format('DD/MM/YYYY lúc HH:mm');
  } else if (diffInHours >= 1) {
    return `${diffInHours} giờ`;
  } else {
    const diffInMinutes = now.diff(postDate, 'minute');
    return `${diffInMinutes} phút`;
  }
};

interface PostCardProps {
  post: PostUI;
  postImages: string[];
  users: UserResponse[];
  isFavorite: (postId: number) => boolean;
  onLike: (postId: number) => Promise<void>;
  onComment: (post: PostUI) => void;
  commentCount?: number;
  favoriteCounts: { [postId: number]: number };
  refreshPostCount: (postId: number) => Promise<void>;
  isLikeLoading?: boolean;
}

const PostCard: React.FC<PostCardProps> = React.memo(({
  post,
  postImages,
  users,
  isFavorite,
  onLike,
  onComment,
  commentCount = 0,
  favoriteCounts,
  refreshPostCount,
  isLikeLoading = false,
}) => {
  const author = getObjectByEmail(users, post.userid);
  const isLiked = isFavorite(post.id);
  useSelector((state: RootState) => state.comment);

  const handleLike = () => {
    onLike(post.id);
    refreshPostCount(post.id);
  };

  const handleComment = () => {
    onComment(post);
    refreshPostCount(post.id);
  };

  return (
    <Card
      style={{
        marginBottom: 20,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--yahoo-border)',
        background: 'var(--yahoo-bg)'
      }}
    >
      {/* Post Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={48}
            src={author?.avatar}
            style={{ 
              marginRight: 12,
              border: '2px solid var(--yahoo-border)'
            }}
          />
          <div>
            <Title level={5} style={{ 
              margin: 0, 
              color: 'var(--yahoo-text)',
              fontWeight: '600'
            }}>
              {author?.username || 'Người dùng'}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text style={{ 
                fontSize: 12, 
                color: 'var(--yahoo-text-secondary)',
                marginRight: 8
              }}>
                {formatTime(post.createdat)}
              </Text>
              <GlobalOutlined style={{ 
                fontSize: 12, 
                color: 'var(--yahoo-text-secondary)' 
              }} />
            </div>
          </div>
        </div>
        <Tooltip title="Tùy chọn">
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{
              color: 'var(--yahoo-text-secondary)',
              fontSize: 16,
              width: 32,
              height: 32,
              borderRadius: 6
            }}
          />
        </Tooltip>
      </div>

      {/* Post Content */}
      <Paragraph style={{ 
        fontSize: 14, 
        lineHeight: 1.6,
        color: 'var(--yahoo-text)',
        marginBottom: postImages.length > 0 ? 16 : 0
      }}>
        {post.content}
      </Paragraph>

      {/* Post Images */}
      {postImages.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <PostImages images={postImages} />
        </div>
      )}

      {/* Post Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid var(--yahoo-border)',
        borderBottom: '1px solid var(--yahoo-border)',
        marginBottom: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text style={{ 
            fontSize: 13, 
            color: 'var(--yahoo-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <LikeOutlined style={{ color: 'var(--yahoo-primary)' }} />
            {favoriteCounts[post.id] || 0} lượt thích
          </Text>
          <Text style={{ 
            fontSize: 13, 
            color: 'var(--yahoo-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <CommentOutlined />
            {commentCount} bình luận
          </Text>
        </div>
      </div>

      {/* Post Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          type="text"
          icon={isLikeLoading ? <LoadingOutlined /> : <LikeOutlined />}
          onClick={handleLike}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            color: isLiked ? 'var(--yahoo-primary)' : 'var(--yahoo-text-secondary)',
            fontWeight: isLiked ? '600' : '400',
            background: isLiked ? 'rgba(114, 6, 247, 0.1)' : 'transparent',
            border: '1px solid transparent'
          }}
        >
          {isLiked ? 'Đã thích' : 'Thích'}
        </Button>
        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={handleComment}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            color: 'var(--yahoo-text-secondary)',
            border: '1px solid transparent'
          }}
        >
          Bình luận
        </Button>
        <Button
          type="text"
          icon={<ShareAltOutlined />}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            color: 'var(--yahoo-text-secondary)',
            border: '1px solid transparent'
          }}
        >
          Chia sẻ
        </Button>
      </div>
    </Card>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;