import React, { useContext, useState } from 'react';
import { Modal, Input, Button, Upload, Image, type UploadFile } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { PictureOutlined, SmileOutlined, GlobalOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { getPostImages, sendPostImageThunk } from '../../features/postImg/postImgThunks';
import { getPosts, sendPostThunk } from '../../features/post/postThunks';
import type { Post as PostType } from '../../interface/UserResponse';
import { uploadImageToCloudinary } from '../../config/CloudinaryConfig';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../stores/store';
import { getObjectById } from '../../services/respone';
import { ContextAuth } from '../../contexts/AuthContext';


interface CreatPostModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setNewPostContent: (newPostContent: string) => void;
    newPostContent: string;
    selectedImages: File[];
    setSelectedImages: (images: File[]) => void;
    uploadFileList: UploadFile[];
    setUploadFileList: (files: UploadFile[]) => void;
    previewImages: string[];
    setPreviewImages: (images: string[]) => void;
    handleImageSelect: (info: UploadChangeParam<UploadFile>) => void;
}

const CreatPostModal: React.FC<CreatPostModalProps> = ({
    open,
    setOpen,
    setNewPostContent,
    newPostContent,
    selectedImages,
    setSelectedImages,
    uploadFileList,
    setUploadFileList,
    previewImages,
    setPreviewImages,
    handleImageSelect

}) => {
    const { items } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { accountLogin } = useContext(ContextAuth);
    const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = () => {
        setOpen(false);
        setNewPostContent('');
        setSelectedImages([]);
        setPreviewImages([]);
        setUploadFileList([]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviewImages = previewImages.filter((_, i) => i !== index);
        const newUploadFileList = uploadFileList.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setPreviewImages(newPreviewImages);
        setUploadFileList(newUploadFileList);
    };

    const handlePostSubmit = async () => {
        if (!newPostContent.trim() && selectedImages.length === 0) return;

        setIsSubmitting(true);
        
        try {
            const newPost = {
                id: 0,
                userid: currentUserId ?? 0,
                content: newPostContent,
                createdat: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status: 1
            };
            
            const postResult = await dispatch(sendPostThunk(newPost as PostType)).unwrap();
            const postId = postResult.data?.id || 0;

            if (selectedImages.length > 0) {
                const uploadPromises = selectedImages.map(async (image, index) => {
                    try {
                        const imageUrl = await uploadImageToCloudinary(image, 'post_images');
                        await dispatch(sendPostImageThunk({ postid: postId, imgurl: imageUrl })).unwrap();
                    } catch (uploadError) {
                        console.error(`Lỗi khi upload ảnh ${index + 1}:`, uploadError);
                    }
                });

                await Promise.allSettled(uploadPromises);
                
                // Cập nhật lại ảnh cho post mới để hiển thị ngay lập tức
                if (postId > 0) {
                    await dispatch(getPostImages(postId)).unwrap();
                }
            }
            
            setOpen(false);
            setNewPostContent('');
            setSelectedImages([]);
            setPreviewImages([]);
            setUploadFileList([]);

            // Refresh lại toàn bộ posts để cập nhật UI
            await dispatch(getPosts()).unwrap();
            
        } catch (error) {
            console.error("Lỗi khi đăng bài viết:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>

            <Modal
                title="Tạo bài viết"
                open={open}
                onOk={handlePostSubmit}
                onCancel={handleCancel}
                footer={null}
            >
                <Input.TextArea
                    placeholder="Bạn đang nghĩ gì thế?"
                    autoSize={{ minRows: 3, maxRows: 10 }}
                    style={{ marginBottom: 16 }}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />

                {selectedImages.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedImages.map((file, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <Image
                                        src={previewImages[index] || (file instanceof File ? URL.createObjectURL(file) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+')}
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

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Upload
                        multiple
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={handleImageSelect}
                        showUploadList={false}
                        fileList={uploadFileList}
                    >
                        <Button type="text" icon={<PictureOutlined style={{ fontSize: '18px', color: '#45bd62' }} />} style={{ flex: 1, borderRadius: '8px', height: '40px' }}>
                            Ảnh/Video
                        </Button>
                    </Upload>
                    <Button type="text" icon={<SmileOutlined style={{ fontSize: '18px', color: '#f7b928' }} />} style={{ flex: 1, borderRadius: '8px', height: '40px' }}>
                        Cảm xúc
                    </Button>
                    <Button type="text" icon={<GlobalOutlined style={{ fontSize: '18px', color: '#1877f2' }} />} style={{ flex: 1, borderRadius: '8px', height: '40px' }}>
                        Vị trí
                    </Button>
                </div>

                <div>
                    {!newPostContent.trim() && selectedImages.length === 0 ? (
                        <Button
                            type="primary"
                            disabled
                            style={{
                                borderRadius: '50px',
                                width: '100%',
                                height: '40px',
                                backgroundColor: '#f0f2f5',
                                color: '#000',
                                fontSize: '15px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                marginTop: '10px'
                            }}> Đăng bài viết </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={handlePostSubmit}
                            disabled={isSubmitting}
                            style={{
                                borderRadius: '50px',
                                width: '100%',
                                height: '40px',
                                backgroundColor: '#1877f2',
                                color: '#fff',
                                fontSize: '15px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                marginTop: '10px',
                            }}
                            icon={isSubmitting ? <LoadingOutlined /> : null}
                        > 
                            {isSubmitting ? 'Đang đăng bài viết...' : 'Đăng bài viết'}
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default CreatPostModal;