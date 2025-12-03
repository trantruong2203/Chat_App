import React, { useContext, useEffect, useState } from 'react';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Input, List, Typography, Badge, Divider } from 'antd';
import { getObjectByEmail, getObjectById } from '../../services/respone';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import { ContextAuth } from '../../contexts/AuthContext';
import type { FriendShip, UserResponse } from '../../interface/UserResponse';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
const { Search } = Input;
const { Title, Text } = Typography;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

interface OnlineUser {
  userId: string;
  user: UserResponse;
}

const ListContacts: React.FC = () => {
  const [contacts, setContacts] = useState<FriendShip[]>([]);
  const { accountLogin } = useContext(ContextAuth);
  const friendShip = useSelector((state: RootState) => state.friendship.items);
  const { items } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  useEffect(() => {
    const getFriendShip = () => {
      const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
      if (!currentUserId) return [];
      return friendShip.filter(item =>
        (item.sentat == currentUserId || item.userid == currentUserId) && item.status == 0
      );
    };
    const friendShipData = getFriendShip();
    setContacts(friendShipData);
  }, [friendShip, items, accountLogin]);
  console.log(contacts);
  

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
      if (!currentUserId) {
        setContacts([]);
        return;
      }
      const originalContacts = friendShip.filter(item =>
        (item.sentat == currentUserId || item.userid == currentUserId) && item.status == 0
      );
      setContacts(originalContacts);
    } else {
      // Tìm kiếm trên toàn bộ danh sách bạn bè thay vì chỉ danh sách hiện tại
      if (!currentUserId) {
        setContacts([]);
        return;
      }
      const allFriends = friendShip.filter(item =>
        (item.sentat == currentUserId || item.userid == currentUserId) && item.status == 0
      );
      setContacts(allFriends.filter(item => {
        const friendInfo = item.sentat == currentUserId
          ? getObjectByEmail(items, item.userid)
          : getObjectByEmail(items, item.sentat);
        return friendInfo?.username?.toLowerCase().includes(value.toLowerCase());
      }));
    }
  };

  const handleContactClick = (friendShipItem: FriendShip) => {
    const chatPartnerId = friendShipItem.sentat == currentUserId
      ? friendShipItem.userid
      : friendShipItem.sentat;
    navigate(`/${chatPartnerId}`);
  };

  useEffect(() => {
    // Kết nối socket
    const newSocket = io(SOCKET_URL, {
      withCredentials: true
    });

    // Xử lý đăng nhập socket
    if (accountLogin?.email) {
        newSocket.emit("login", accountLogin.email);
    }

    // Lắng nghe sự kiện user online
    newSocket.on("userOnline", (data: OnlineUser) => {
        setOnlineUsers(prev => {
            const existingUser = prev.find(user => user.userId === data.userId);
            if (!existingUser) {
                return [...prev, data];
            }
            return prev;
        });
    });

    // Lắng nghe sự kiện user offline
    newSocket.on("userOffline", (data: { userId: string }) => {
        setOnlineUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    // Nhận danh sách user online hiện tại
    newSocket.on("onlineUsers", (users: OnlineUser[]) => {
        setOnlineUsers(users);
    });
    
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
}, [accountLogin?.email]);

// Xử lý logout khi component unmount
useEffect(() => {
    return () => {
        if (socket && socket.connected) {
            socket.emit("logout");
        }
    };
}, [socket]);

const isUserOnline = (message: FriendShip): boolean => {
  const partnerId = message.sentat == currentUserId ? message.userid : message.sentat;
  return onlineUsers.some(onlineUser => onlineUser.user.id == partnerId);
};
  return (
    <div
      style={{
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px'
      }}
    >
      <div style={{ padding: '0 10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <UserOutlined style={{ fontSize: '20px' }} />
          <Title level={4} style={{ margin: "10px 0" }}>Danh sách bạn bè</Title>
        </div>

        <Search
          placeholder="Tìm kiếm bạn bè..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ marginBottom: '20px' }}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Divider style={{ margin: '10px 0' }} />

        <List
          dataSource={contacts}
          renderItem={item => {
            const friendInfo = item.sentat == currentUserId
              ? getObjectByEmail(items, item.userid)
              : getObjectByEmail(items, item.sentat);

            return (
              <List.Item
                style={{
                  padding: '12px 5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  borderRadius: '8px'
                }}
                className="contact-item"
                onClick={() => handleContactClick(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      dot
                      color={isUserOnline(item) ? 'green' : 'gray'}
                      offset={[-5, 40]}
                    >
                      <Avatar
                        src={friendInfo?.avatar ?? ''}
                        size={50}
                        style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                      />
                    </Badge>
                  }
                  title={<Text strong style={{ fontSize: '18px' }}>{friendInfo?.username ?? '---'}</Text>}
                />
              </List.Item>
            )
          }}
        />
      </div>
    </div>
  );
};

export default ListContacts;