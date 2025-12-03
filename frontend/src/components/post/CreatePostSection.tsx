import React from 'react';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Upload,
  Tooltip,
} from 'antd';
import {
  PictureOutlined,
  SmileOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { getObjectByEmail } from '../../services/respone';
import type { UserResponse } from '../../interface/UserResponse';
import type { UploadChangeParam } from 'antd/es/upload';

interface CreatePostSectionProps {
  users: UserResponse[];
  currentUserId: number | undefined;
  onCreatePost: () => void;
  handleImageSelect: (info: UploadChangeParam<UploadFile>) => void;
  uploadFileList: UploadFile[];
}

const CreatePostSection: React.FC<CreatePostSectionProps> = React.memo(({
  users,
  currentUserId,
  onCreatePost,
  handleImageSelect,
  uploadFileList
}) => {
  const currentUser = getObjectByEmail(users, currentUserId ?? '');

  return (
    <Card style={{
      marginBottom: 20,
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid var(--yahoo-border)',
      background: 'var(--yahoo-bg)'
    }}>
      {/* Create Post Input */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Avatar
          src={currentUser?.avatar}
          size={48}
          style={{ 
            marginRight: 12,
            border: '2px solid var(--yahoo-border)'
          }}
        />
        <Button
          type="text"
          style={{
            flex: 1,
            borderRadius: '8px',
            height: '48px',
            backgroundColor: 'var(--yahoo-bg-secondary)',
            color: 'var(--yahoo-text-secondary)',
            fontSize: '15px',
            justifyContent: 'flex-start',
            padding: '0 16px',
            border: '1px solid var(--yahoo-border)'
          }}
          onClick={onCreatePost}
        >
          Bạn đang nghĩ gì?
        </Button>
      </div>

      <Divider style={{ margin: '12px 0', borderColor: 'var(--yahoo-border)' }} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip title="Thêm ảnh/video">
          <Upload
            multiple
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleImageSelect}
            showUploadList={false}
            fileList={uploadFileList}
          >
            <Button 
              type="text" 
              icon={<PictureOutlined style={{ fontSize: '18px', color: 'var(--yahoo-primary)' }} />} 
              style={{ 
                flex: 1, 
                borderRadius: '8px', 
                height: '40px',
                color: 'var(--yahoo-text-secondary)',
                border: '1px solid transparent'
              }}
            >
              Ảnh/Video
            </Button>
          </Upload>
        </Tooltip>

        <Tooltip title="Thêm cảm xúc">
          <Button
            type="text"
            icon={<SmileOutlined style={{ fontSize: '18px', color: 'var(--yahoo-warning)' }} />}
            style={{ 
              flex: 1, 
              borderRadius: '8px', 
              height: '40px',
              color: 'var(--yahoo-text-secondary)',
              border: '1px solid transparent'
            }}
          >
            Cảm xúc
          </Button>
        </Tooltip>

        <Tooltip title="Thêm vị trí">
          <Button
            type="text"
            icon={<GlobalOutlined style={{ fontSize: '18px', color: 'var(--yahoo-success)' }} />}
            style={{ 
              flex: 1, 
              borderRadius: '8px', 
              height: '40px',
              color: 'var(--yahoo-text-secondary)',
              border: '1px solid transparent'
            }}
          >
            Vị trí
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
});

CreatePostSection.displayName = 'CreatePostSection';

export default CreatePostSection;