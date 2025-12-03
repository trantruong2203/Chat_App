import { Modal, Card, Avatar, Button, Divider, Typography, Space } from "antd";
import { MessageOutlined, UserAddOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { FriendShip, UserResponse } from "../../interface/UserResponse";
import { getObjectById } from "../../services/respone";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ContextAuth } from "../../contexts/AuthContext";
import type { RootState, AppDispatch } from "../../stores/store";
import { useContext } from "react";
import { createdFriendShip } from "../../features/friendship/friendshipThunks";
import { toast } from "react-toastify";

const { Text } = Typography;

const NotFriendModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  findUser: UserResponse;
}> = ({ isModalOpen, handleCancel, findUser }) => {
  const { items } = useSelector((state: RootState) => state.user);
  const friendShip = useSelector((state: RootState) => state.friendship.items);
  const dispatch = useDispatch<AppDispatch>();
  const { accountLogin } = useContext(ContextAuth);

  const getFrienShip = (): React.ReactNode | string => {
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
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InfoCircleOutlined style={{ color: '#07C160', marginRight: '10px' }} />
          <span>Thông tin tài khoản</span>
        </div>
      }
      centered
    >
      <Card
        style={{ borderRadius: 4, margin: 0, boxShadow: "none" }}
        cover={
          <img
            alt="cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2qLE1GXRzDLzoFHGMGQkXJUh1b5osxM7v6w&s"
            style={{ height: 150, objectFit: "cover", borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
          />
        }
      >
        <div style={{ padding: 16, paddingTop: 0, textAlign: "center" }}>
          <Avatar
            size={80}
            src={findUser?.avatar}
            style={{
              marginTop: -40,
              border: "3px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#f0f0f0"
            }}
          />
          <h2 style={{ fontSize: '18px', marginTop: '10px' }}>{findUser.username}</h2>
          <Space style={{ marginTop: '10px' }}>
            <Button
              icon={<UserAddOutlined />}
              type="primary"
              style={{
                borderRadius: 4,
                minWidth: 100,
                backgroundColor: '#07C160',
                borderColor: '#07C160'
              }}
              onClick={handleAddFriend}
            >
              {getFrienShip()}
            </Button>
            <Button
              icon={<MessageOutlined style={{ color: "#07C160" }} />}
              style={{
                borderRadius: 4,
                border: "1px solid #07C160",
                color: "#07C160",
                background: "#fff",
                minWidth: 100
              }}
            >
              Nhắn tin
            </Button>
          </Space>
          <Divider style={{ margin: '16px 0', background: "#e6e6e6" }} />
          <div style={{ textAlign: "left" }}>
            <Text style={{ color: "#888", fontSize: 13, fontWeight: 600 }}>Thông tin cá nhân</Text>
            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <Text strong >Giới tính:</Text>
              <Text>{findUser.gender || 'Chưa cập nhật'} </Text>
            </div>
            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <Text strong >Ngày sinh:</Text>
              <Text>{findUser.birthday ? (typeof findUser.birthday === 'string' ? new Date(findUser.birthday).toLocaleDateString() : new Date(findUser.birthday).toLocaleDateString()) : 'Chưa cập nhật'}</Text>
            </div>
            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <Text strong >Số điện thoại:</Text>
              <Text>{findUser.phone || 'Chưa cập nhật'}</Text>
            </div>
          </div>
          <Divider style={{ margin: '16px 0', background: "#e6e6e6" }} />
        
        </div>
      </Card>
    </Modal>
  )
};

export default NotFriendModal;