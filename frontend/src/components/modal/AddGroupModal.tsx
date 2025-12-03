import React, { useContext, useEffect, useState } from 'react';
import { Modal, Input, Button, List, Avatar, Checkbox, Typography, Upload, type UploadProps, type GetProp } from 'antd';
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import '../../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { ContextAuth } from '../../contexts/AuthContext';
import type { RootState, AppDispatch } from '../../stores/store';
import { getObjectById, getObjectByEmail } from '../../services/respone';
import { createdChatGroup } from '../../features/chatGroup/chatGroupThunks';
import type { ChatGroup, GroupMember } from '../../interface/UserResponse';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { uploadImageToCloudinary } from '../../config/CloudinaryConfig';
import { createdGroupMember } from '../../features/groupMember/groupMemberThunks';
import { sendMessageThunk } from '../../features/messages/messageThunks';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { items } = useSelector((state: RootState) => state.user);
  const friendShip = useSelector((state: RootState) => state.friendship.items);
  const { accountLogin } = useContext(ContextAuth);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();  

  useEffect(() => {
    const getFriendShip = () => {
      if (!currentUserId) return [];
      return friendShip.filter(item =>
        (item.sentat == currentUserId || item.userid == currentUserId) && item.status == 0
      );
    };
    const friendShipData = getFriendShip();
    const users = friendShipData.map(item => {
      const targetUserId = item.userid == currentUserId ? item.sentat : item.userid;
      const user = getObjectByEmail(items, targetUserId);
      return user ? {
        id: user.id.toString(),
        username: user.username,
        avatar: user.avatar
      } as User : null;
    }).filter(user => user !== null) as User[];
    setRecentUsers(users);
  }, [friendShip, items, accountLogin, currentUserId]);

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!previewImage) {
        toast.error('Vui lòng chọn ảnh nhóm');
        return;
      } else if (!groupName) {
        toast.error('Vui lòng nhập tên nhóm');
        return;
      } else if (selectedUsers.length === 0) {
        toast.error('Vui lòng chọn thành viên');
        return;
      }
      setUploading(true);

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile, 'group');
      } else if (previewImage.startsWith('data:')) {
        // Nếu là base64, chuyển đổi thành File
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], 'group_image.jpg', { type: blob.type });
        imageUrl = await uploadImageToCloudinary(file, 'group');
      } else {
        // Giả sử previewImage là URL thực sự
        imageUrl = previewImage;
      }

      const group = {
        name: groupName ?? '',
        avatar: imageUrl ?? '',
        creatorid: currentUserId ?? 0,
        createdat: dayjs().format('YYYY-MM-DD'),
        status: 1,
      } as ChatGroup;

      const response = await dispatch(createdChatGroup(group)).unwrap();
      const groupId = response.data?.id ?? 0;
    
      await dispatch(createdGroupMember({
        groupid: groupId,
        userid: currentUserId ?? 0,
        joinedat: dayjs().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
        roleid: 1,
      } as unknown as GroupMember));

      let allMembersAdded = true;
      
      const addMemberPromises = selectedUsers.map(async (userId) => {
        try {
          const memberData = {
            groupid: groupId,
            userid: parseInt(userId),
            joinedat: dayjs().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
            roleid: 2,
          } as unknown as GroupMember;
          
          const memberResponse = await dispatch(createdGroupMember(memberData));
          return memberResponse.payload !== undefined;
        } catch (error) {
          console.error("Lỗi khi thêm thành viên:", error);
          return false;
        }
      });
      
      const results = await Promise.all(addMemberPromises);
      allMembersAdded = results.every(result => result === true);

      await dispatch(sendMessageThunk(
        {
          id: 0,
          groupid: groupId,
          senderid: currentUserId ?? 0,
          receiverid: null,
          content: `${getObjectByEmail(items, currentUserId ?? '')?.username} đã tạo nhóm chat ${groupName}`,
          sentat: dayjs().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
          status: 1,
          messageid: 0
        }
      ));
    
      if (response.data && allMembersAdded) {
        toast.success('Tạo nhóm chat thành công');
        resetForm();
        onClose();
      } else {
        toast.error('Tạo nhóm chat thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Tạo nhóm chat thất bại');
    } finally {
      setUploading(false);
    }
  };
  
  const resetForm = () => {
      setGroupName('');
      setSearchText('');
      setSelectedUsers([]);
      setPreviewImage('');
      setImageFile(null);
    };

    const handleCancel = () => {
      resetForm();
      onClose();
    };

    // Lọc và nhóm người dùng theo chữ cái đầu tiên
    const groupByFirstLetter = (users: User[]) => {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
      );

      const grouped: { [key: string]: User[] } = {};

      filtered.forEach(user => {
        const firstLetter = user.username.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(user);
      });

      return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    };

    const groupedUsers = groupByFirstLetter(recentUsers);

    const uploadProps = {
      beforeUpload: (file: FileType) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setPreviewImage(reader.result as string);
            setImageFile(file);
          }
        };
        reader.onerror = () => {
          toast.error('Lỗi khi đọc file ảnh');
        };
        reader.readAsDataURL(file);
        return false;
      },
    };

    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UsergroupAddOutlined style={{ color: '#07C160', marginRight: '10px' }} />
            <span>Tạo nhóm chat</span>
          </div>
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ borderRadius: '4px' }}>
            Hủy
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={handleCreateGroup}
            loading={uploading}
            disabled={!groupName.trim() || selectedUsers.length === 0 || !previewImage}
            style={{
              borderRadius: '4px',
              backgroundColor: '#07C160',
              borderColor: '#07C160'
            }}
          >
            Tạo nhóm
          </Button>
        ]}
        width={400}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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

          <Input
            placeholder="Nhập tên nhóm..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1px solid #e8e8e8',
              borderRadius: '0',
              width: '100%'
            }}
          />
        </div>

        <Input
          placeholder="Tìm kiếm thành viên..."
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginBottom: '10px',
            borderRadius: '4px',
            width: '100%'
          }}
        />

        <Typography.Text style={{ fontWeight: 'bold', display: 'block', margin: '10px 0', fontSize: '14px' }}>
          Chọn thành viên
        </Typography.Text>

        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: '4px',
          padding: '0 8px'
        }}>
          {groupedUsers.length > 0 ? (
            groupedUsers.map(([letter, users]) => (
              <div key={letter}>
                <Typography.Title level={5} style={{ margin: '8px 0', fontSize: '14px', color: '#07C160' }}>
                  {letter}
                </Typography.Title>
                <List
                  dataSource={users}
                  renderItem={user => (
                    <List.Item
                      style={{
                        padding: '8px 0',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f5f5f5'
                      }}
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleToggleUser(user.id)}
                          style={{
                            marginRight: '10px',
                          }}
                        />
                        <Avatar
                          src={user.avatar}
                          style={{ marginRight: '10px' }}
                          size={36}
                        />
                        <Typography.Text>{user.username}</Typography.Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Typography.Text type="secondary">Không tìm thấy liên hệ</Typography.Text>
            </div>
          )}
        </div>

        {selectedUsers.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Typography.Text style={{ fontSize: '14px', color: '#07C160' }}>
              Đã chọn {selectedUsers.length} thành viên
            </Typography.Text>
          </div>
        )}
      </Modal>
    );
  };

  export default AddGroupModal;
