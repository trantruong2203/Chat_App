import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Input,
  Button,
  Avatar,
  Space,
  Upload,
  Image
} from 'antd';
import {
  SendOutlined,
  SmileOutlined,
  PictureOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { CommentFormProps } from '../../../interface/Comment';
import { ContextAuth } from '../../../contexts/AuthContext';
import { getObjectById } from '../../../services/respone';
import type { RootState } from '../../../stores/store';
import type { CommentFormData } from '../../../interface/Comment';
import dayjs from 'dayjs';
  

const { TextArea } = Input;

const CommentForm: React.FC<CommentFormProps> = ({
  parentId,
  placeholder = "Viết bình luận...",
  onCancel,
  loading = false,
  autoFocus = false,
  compact = false,
  handleImageSelect,
  handleRemoveImage,
  previewImages,
  selectedImages,
  uploadFileList,
  handleCommentSubmit
}) => {
  const [content, setContent] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const accountLogin = useContext(ContextAuth);
  const { items } = useSelector((state: RootState) => state.user);
  const currentUser = getObjectById(items, accountLogin?.accountLogin?.email ?? '');


  useEffect(() => {
    if (autoFocus && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [autoFocus]);

  const handleCancel = () => {
    setContent('');
    if (onCancel) {
      onCancel();
    }
  };

  const isSubmitDisabled = !content.trim() || loading;

  return (
    <div className={`comment-form ${compact ? 'compact' : ''}`} style={{ maxWidth: '100%' }}>
      <div className="comment-form-content">
        {!compact && (
          <Avatar
            src={currentUser?.avatar}
            size={40}
            className="comment-form-avatar"
          />
        )}

        <div className="comment-form-input-container">
          <TextArea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoSize={{ minRows: compact ? 1 : 2, maxRows: 6 }}
            className="comment-form-textarea"
            disabled={loading}
            style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
          />


          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space wrap>
                <Button
                  type="text"
                  icon={<SmileOutlined />}
                  size="small"
                  className="comment-tool-btn"
                  title="Thêm emoji"
                />
                <Upload
                  multiple
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={handleImageSelect}
                  showUploadList={false}
                  fileList={uploadFileList}
                >
                  <Button type="text" icon={<PictureOutlined style={{ fontSize: '18px', color: '#45bd62' }} />} style={{ flex: 1, borderRadius: '8px', height: '40px' }}>
                  </Button>
                </Upload>
              </Space>
              <div className="comment-form-submit">
                <Space wrap>
                  {(compact || content) && (
                    <Button
                      size="small"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                  )}
                  <Button
                    type="primary"
                    size="small"
                    icon={<SendOutlined />}
                    onClick={() => {
                      const commentData: CommentFormData = {
                        id: 0, 
                        userid: currentUser?.id || 0,
                        postid: 0, 
                        content: content.trim(),
                        createdat: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        iconid: 0,
                        imgurl: '',
                        commentid: parentId || undefined
                      };
                      handleCommentSubmit(commentData);
                      handleCancel();
                    }}
                    loading={loading}
                    disabled={isSubmitDisabled}
                  >
                    {compact ? 'Trả lời' : 'Bình luận'}
                  </Button>
                </Space>
              </div>
            </div>
            {selectedImages && selectedImages.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedImages.map((file: File, index: number) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                      <Image
                        src={previewImages && previewImages[index] || (file instanceof File ? URL.createObjectURL(file) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+')}
                        alt={`Selected ${index}`}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>

        </div>
      </div>
    </div>
  );
};

export default CommentForm;
