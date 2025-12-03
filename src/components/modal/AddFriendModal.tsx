import React, { useContext, useState, type JSX } from 'react';
import { Modal, Input, List, Avatar, Button, Typography, Divider, Space, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../stores/store';
import type { UserResponse, FriendShip } from '../../interface/UserResponse';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { createdFriendShip } from '../../features/friendship/friendshipThunks';
import { ContextAuth } from '../../contexts/AuthContext';
import { getObjectById } from '../../services/respone';
import { toast } from 'react-toastify';

const { Text } = Typography;

const AddFriendModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOpenNotFriendModal: (item: UserResponse) => void;
  findUser: UserResponse; // BẮT BUỘC phải có
  setFindUser: (findUser: UserResponse) => void;
}> = ({ isModalOpen, handleCancel, handleOpenNotFriendModal, findUser, setFindUser }) => {
  const [searchValue, setSearchValue] = useState('');
  const { items } = useSelector((state: RootState) => state.user);
  const friendShip = useSelector((state: RootState) => state.friendship.items);
  const dispatch = useDispatch<AppDispatch>();
  const { accountLogin } = useContext(ContextAuth);

  const getFrienShip = (): JSX.Element | string => {
    const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
    
    // Kiểm tra nếu người dùng tìm kiếm ra chính mình
    if (currentUserId === findUser.id) {
      return "Đây là tài khoản của bạn";
    }
    
    const findFriendShip = friendShip.find(item => 
      // Kiểm tra nếu người dùng hiện tại đã gửi lời mời kết bạn cho người được tìm kiếm
      (item.userid == currentUserId && item.sentat == findUser.id) || 
      // Hoặc người được tìm kiếm đã gửi lời mời kết bạn cho người dùng hiện tại
      (item.userid == findUser.id && item.sentat == currentUserId)
    );

    if (!findFriendShip) {
      return (
    <Button
      type="primary"
      size="small"
      onClick={handleAddFriend}
      style={{ backgroundColor: '#07C160', borderColor: '#07C160', color: 'white' }}
    >
      Kết bạn
    </Button>
  );
    }
    if (findFriendShip && findFriendShip.status === 0) {
      return "Đã là bạn bè";
    }
    if (findFriendShip && findFriendShip.status === 1) {
      return "Đã gửi lời mời kết bạn";
    }
  
    return '';
  };

  const handleSearch = (): void => {
    const findAccount = items.find(item => item.email === searchValue || item.phone === searchValue);
    if (findAccount) {
      setFindUser(findAccount);
    }
  };

  const handleAddFriend = (): void => {
    const sender = getObjectById(items, accountLogin?.email ?? '');

    if (!sender || !findUser?.id) {
      console.error('Invalid sender or receiver info');
      return;
    }

    const friendship: FriendShip = {
      id: 0,
      userid: sender.id,
      sentat: findUser.id,
      status: 1,
    };

    dispatch(createdFriendShip(friendship));
    toast.success('Đã gửi lời mời kết bạn');

  };


  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserAddOutlined style={{ color: '#07C160', marginRight: '10px' }} />
          <span>Thêm bạn</span>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      width={400}
      footer={[
        <Button key="cancel" onClick={handleCancel} style={{ borderRadius: '4px' }}>Hủy</Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <Input
            prefix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />}
            placeholder="Nhập email hoặc số điện thoại"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              width: '100%',
              backgroundColor: '#07C160',
              borderColor: '#07C160',
              borderRadius: '4px'
            }}
          >
            Tìm kiếm
          </Button>
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <div style={{ marginBottom: '8px' }}>
          <Text 
            strong 
            style={{ fontSize: '14px' }}
            onClick={() => handleOpenNotFriendModal(findUser)}
          >
            Kết quả tìm kiếm
          </Text>
        </div>
        {
          findUser.email ? (
            <List
              itemLayout="horizontal"
              dataSource={[findUser]}
              renderItem={item => (
                <List.Item
                  actions={[
                    <>
                    {getFrienShip()}
                    </>
                  ]}
                >
                  <List.Item.Meta

                    avatar={<Avatar src={item.avatar} style={{ width: 40, height: 40 }} />}
                    title={<Text strong onClick={() => handleOpenNotFriendModal(item)} style={{ cursor: 'pointer' }}>{item.username}</Text>}
                    description={<Text type="secondary" style={{ fontSize: '13px' }}>{item.phone}</Text>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không tìm thấy người dùng"
            />
          )
        }
      </Space>
    </Modal>
  );
};

export default AddFriendModal;