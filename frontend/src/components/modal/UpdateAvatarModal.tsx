import { Modal, Upload, Button, Avatar } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { useState } from 'react';
import { uploadImageToCloudinary } from '../../config/CloudinaryConfig';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../stores/store';
import type { UserResponse } from '../../interface/UserResponse';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { updateUserThunk } from '../../features/users/userThunks';
import { setUser } from '../../features/users/userSlice';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UpdateAvatarModal: React.FC<{
  openUpdateAvatar: boolean,
  setOpenUpdateAvatar: (open: boolean) => void,
}> = ({
  openUpdateAvatar,
  setOpenUpdateAvatar,
}) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const handleCancel = () => {
      setOpenUpdateAvatar(false);
      setImageFile(null);
      setPreviewImage('');
      setLoading(false);
    };

    const handleUpload = async () => {
      try {
        if (!previewImage) {
          toast.error('Vui lòng chọn ảnh trước khi lưu!');
          return;
        }
        setLoading(true);

        let imageUrl = '';
        
        // Xử lý upload ảnh lên Cloudinary
        if (imageFile) {
          // Nếu có file ảnh được chọn
          imageUrl = await uploadImageToCloudinary(imageFile, 'user');
        } else if (previewImage.startsWith('data:')) {
          // Nếu là base64, chuyển đổi thành File
          const response = await fetch(previewImage);
          const blob = await response.blob();
          const file = new File([blob], 'user_image.jpg', { type: blob.type });
          imageUrl = await uploadImageToCloudinary(file, 'user');
        } else {
          imageUrl = previewImage;
        }

        if (imageUrl === user?.avatar) {
          toast.info('Không có thông tin nào thay đổi');
          return;
        }

        await dispatch(updateUserThunk({ email: user?.email || '', account: { avatar: imageUrl } as UserResponse })).unwrap();
        if (user) {
          dispatch(setUser({
            ...user,
            avatar: imageUrl
          }));
        }

        toast.success('Cập nhật ảnh đại diện thành công!');
        setOpenUpdateAvatar(false);
        setPreviewImage('');
        setImageFile(null);
        
      } catch (error: unknown) {
        console.error('Lỗi khi tải ảnh lên:', error);
        
        // Xử lý lỗi chi tiết hơn
        if (error && typeof error === 'object' && 'message' in error) {
          toast.error(`Lỗi: ${(error as { message: string }).message}`);
        } else if (typeof error === 'string') {
          toast.error(error);
        } else {
          toast.error('Tải ảnh lên thất bại. Vui lòng thử lại!');
        }
      } finally {
        setLoading(false);
      }
    };

    const uploadProps = {
      beforeUpload: (file: FileType) => {
        // Kiểm tra loại file
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          toast.error('Chỉ được phép tải lên file ảnh!');
          return false;
        }

        // Kiểm tra kích thước file (giới hạn 5MB)
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          toast.error('Kích thước file phải nhỏ hơn 5MB!');
          return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (reader.result) {
            setPreviewImage(reader.result as string);
            setImageFile(file);
          }
        };
        return false;
      },
    };


    return (
      <>
        <Modal
          title="Cập nhật ảnh đại diện"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={openUpdateAvatar}
          onCancel={handleCancel}
          footer={null}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {previewImage ? (
              <div style={{ position: 'relative' }}>
                <Avatar
                  src={previewImage}
                  alt="Ảnh nhóm"
                  size={60}
                  style={{ marginRight: '10px' }}
                />
                <Button
                  size="small"
                  danger
                  onClick={() => {
                    setPreviewImage('');
                    setImageFile(null);
                  }}
                  style={{ position: 'absolute', right: '-10px', top: '-10px', borderRadius: '50%' }}
                >
                  X
                </Button>
              </div>
            ) : (
              <Upload {...uploadProps} showUploadList={false}>
                <Button
                  icon={<MdAddPhotoAlternate size={20} />}
                  style={{
                    borderRadius: '50%',
                    height: '60px',
                    width: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px'
                  }}
                >
                </Button>
              </Upload>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
            <Button type="primary" onClick={handleUpload} disabled={!previewImage || loading}>Lưu</Button>
            <Button type="primary" danger onClick={handleCancel}>Hủy</Button>
          </div>
        </Modal>
      </>
    );
  };

export default UpdateAvatarModal;