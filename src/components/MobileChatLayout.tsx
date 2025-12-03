import React, { useState, useContext, useEffect } from 'react';
import { Layout, Button, Avatar, Input, Space, Empty, Upload, Tooltip, Badge } from 'antd';
import { 
  ArrowLeftOutlined, 
  SendOutlined, 
  PaperClipOutlined, 
  SearchOutlined, 
  UserAddOutlined, 
  UsergroupAddOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../stores/store';
import { ContextAuth } from '../contexts/AuthContext';
import type { Message, ChatGroup, UserResponse } from '../interface/UserResponse';
import { getObjectByEmail, getObjectById } from '../services/respone';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { fetchLastMessagesByUserIdThunk, sendMessageThunk } from '../features/messages/messageThunks';
import { Socket } from 'socket.io-client';
import AddFriendModal from './modal/AddFriendModal';
import AddGroupModal from './modal/AddGroupModal';
import NotFriendModal from './modal/NotFriendModal';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Content } = Layout;

interface OnlineUser {
  userId: string;
  user: UserResponse;
}

interface MobileChatLayoutProps {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
}

const MobileChatLayout: React.FC<MobileChatLayoutProps> = ({ socket, onlineUsers }) => {
  const [currentView, setCurrentView] = useState<'recent' | 'chat'>('recent');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [fullMessages, setFullMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isNotFriendModalOpen, setIsNotFriendModalOpen] = useState(false);
  const [findUser, setFindUser] = useState<UserResponse>({
    id: 0,
    email: '',
    avatar: '',
    password: '',
    confirm: '',
    username: '',
    phone: '',
    gender: '',
    birthday: new Date().toISOString(),
    agreement: false,
    status: 0,
  });

  const { items } = useSelector((state: RootState) => state.user);
  const { accountLogin } = useContext(ContextAuth);
  const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
  const chatGroup = useSelector((state: RootState) => state.chatGroup.items as ChatGroup[]);
  const lastMessages = useSelector((state: RootState) => state.message.lastMessages);
  const groupMember = useSelector((state: RootState) => state.groupMember.items);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!accountLogin || !currentUserId) return;
    dispatch(fetchLastMessagesByUserIdThunk(currentUserId));
  }, [accountLogin, currentUserId, dispatch]);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.senderid === currentUserId || newMessage.receiverid === currentUserId || newMessage.groupid) {
        dispatch(fetchLastMessagesByUserIdThunk(currentUserId));
        
        // Nếu đang ở view chat và tin nhắn thuộc cuộc trò chuyện hiện tại, thêm vào danh sách
        if (currentView === 'chat' && selectedMessage) {
          const isSameConversation = selectedMessage.groupid ? 
            newMessage.groupid === selectedMessage.groupid :
            (newMessage.senderid === selectedMessage.senderid || newMessage.senderid === selectedMessage.receiverid ||
             newMessage.receiverid === selectedMessage.senderid || newMessage.receiverid === selectedMessage.receiverid);
          
          if (isSameConversation) {
            setFullMessages(prev => [...prev, newMessage]);
          }
        }
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, currentUserId, dispatch, currentView, selectedMessage]);

  // Lắng nghe sự kiện loadMessages từ socket
  useEffect(() => {
    if (!socket) return;

    const handleLoadMessages = (loadedMessages: Message[]) => {
      if (Array.isArray(loadedMessages)) {
        setFullMessages(loadedMessages.map(msg => ({
          id: msg.id || 0,
          content: msg.content || 'Tin nhắn không hợp lệ',
          senderid: msg.senderid || 0,
          receiverid: msg.receiverid || 0,
          sentat: msg.sentat || dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: msg.status || 1,
          messageid: msg.messageid || 0,
          groupid: msg.groupid || 0,
        })));
      }
    };

    socket.on('loadMessages', handleLoadMessages);

    return () => {
      socket.off('loadMessages', handleLoadMessages);
    };
  }, [socket]);

  const handleChatSelection = (message: Message) => {
    setSelectedMessage(message);
    setCurrentView('chat');
    
    // Yêu cầu socket load tin nhắn cho cuộc trò chuyện này
    if (socket && currentUserId) {
      if (message.groupid) {
        // Load tin nhắn nhóm
        socket.emit('joinGroup', message.groupid);
        socket.emit('loadGroupMessages', message.groupid);
      } else {
        // Load tin nhắn cá nhân
        const chatPartnerId = message.senderid === currentUserId ? message.receiverid : message.senderid;
        socket.emit('loadPersonalMessages', { userId: currentUserId, partnerId: chatPartnerId });
      }
    }
  };

  const handleBackToRecent = () => {
    setCurrentView('recent');
    setSelectedMessage(null);
    setFullMessages([]);
    setMessageContent('');
    
    // Rời khỏi nhóm nếu đang chat nhóm
    if (socket && selectedMessage?.groupid) {
      socket.emit('leaveGroup', selectedMessage.groupid);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedMessage || !currentUserId) return;
    
    try {
      const chatPartnerId = selectedMessage.groupid ? null :
        selectedMessage.senderid === currentUserId ?
          selectedMessage.receiverid : selectedMessage.senderid;
      const groupId = groupMember.find(item => item.userid == currentUserId && item.groupid == selectedMessage.groupid)?.groupid;

      const newMessage = {
        id: 0,
        groupid: groupId || null,
        senderid: currentUserId,
        receiverid: chatPartnerId || null,
        content: messageContent,
        sentat: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 1,
        messageid: 0
      };

      await dispatch(sendMessageThunk(newMessage)).unwrap();
      setMessageContent('');
      
      // Cập nhật danh sách tin nhắn
      dispatch(fetchLastMessagesByUserIdThunk(currentUserId));
    } catch (error: unknown) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  const getChatPartnerName = (message: Message): string | undefined => {
    if (message.groupid) {
      const group = chatGroup.find((group) => group.id === message.groupid);
      return group?.name;
    }
    return getObjectByEmail(items, message.receiverid === currentUserId ? message.senderid : message.receiverid ?? 0)?.username;
  };

  const getChatPartnerAvatar = (message: Message): string | undefined => {
    if (message.groupid) {
      const group = chatGroup.find((group) => group.id === message.groupid);
      return group?.avatar;
    }
    return getObjectByEmail(items, message.receiverid === currentUserId ? message.senderid : message.receiverid ?? 0)?.avatar;
  };

  const isUserOnline = (message: Message): boolean => {
    const partnerId = message.receiverid == currentUserId ? message.senderid : message.receiverid;
    return onlineUsers.some(onlineUser => onlineUser.user.id == partnerId);
  };

  const handleCancel = (): void => {
    setIsAddFriendModalOpen(false);
    setFindUser({
      id: 0,
      email: '',
      avatar: '',
      password: '',
      confirm: '',
      username: '',
      phone: '',
      gender: '',
      birthday: new Date().toISOString(),
      agreement: false,
      status: 0,
    });
  };

  const handleOpenNotFriendModal = (): void => {
    setIsNotFriendModalOpen(true);
  };

  const handleCancelNotFriend = (): void => {
    setIsNotFriendModalOpen(false);
  };

  // Render RecentChats view
  const renderRecentChats = () => (
    <div className="mobile-recent-chats">
      <div className="mobile-search-header">
        <Input.Search
          placeholder="Tìm kiếm cuộc trò chuyện..."
          allowClear
          prefix={<SearchOutlined style={{ color: 'var(--yahoo-text-secondary)' }} />}
          className="mobile-search-input"
        />
        <div className="mobile-header-actions">
          <Tooltip title="Thêm bạn bè">
            <Button
              type="text"
              icon={<UserAddOutlined />}
              onClick={() => setIsAddFriendModalOpen(true)}
              className="mobile-header-btn"
            />
          </Tooltip>
          <Tooltip title="Tạo nhóm">
            <Button
              type="text"
              icon={<UsergroupAddOutlined />}
              onClick={() => setIsAddGroupModalOpen(true)}
              className="mobile-header-btn"
            />
          </Tooltip>
        </div>
      </div>

      <div className="mobile-chat-list">
        {lastMessages.map((message: Message) => (
          <div
            key={`${message.groupid ? `group-${message.groupid}` : `user-${message.senderid}-${message.receiverid}`}-${message.sentat}`}
            className="mobile-chat-item"
            onClick={() => handleChatSelection(message)}
          >
            <Badge dot color={isUserOnline(message) ? 'var(--yahoo-success)' : 'var(--yahoo-text-secondary)'} offset={[-5, 35]}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={getChatPartnerAvatar(message)}
                className="mobile-chat-avatar"
              />
            </Badge>
            <div className="mobile-chat-info">
              <div className="mobile-chat-header">
                <span className="mobile-chat-name">
                  {getChatPartnerName(message)}
                </span>
                <span className="mobile-chat-time">
                  {dayjs(message.sentat).utcOffset(7).fromNow()}
                </span>
              </div>
              <div className="mobile-chat-message">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Chat view
  const renderChat = () => {
    if (!selectedMessage) return null;

    const chatPartnerName = getChatPartnerName(selectedMessage);
    const chatPartnerAvatar = getChatPartnerAvatar(selectedMessage);

    return (
      <div className="mobile-chat-view">
        <div className="mobile-chat-header">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToRecent}
            className="mobile-back-btn"
          />
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={chatPartnerAvatar}
            className="mobile-chat-avatar"
          />
          <div className="mobile-chat-title">
            <div className="mobile-chat-name">{chatPartnerName}</div>
            <div className="mobile-chat-status">
              {isUserOnline(selectedMessage) ? 'Đang hoạt động' : 'Không hoạt động'}
            </div>
          </div>
        </div>

        <div className="mobile-messages-container">
          {fullMessages.length === 0 ? (
            <div className="mobile-empty-chat">
              <Empty 
                description="Chưa có tin nhắn nào" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <div className="mobile-messages-list">
              {fullMessages.map((msg, index) => {
                const isCurrentUser = msg.senderid === currentUserId;
                return (
                  <div key={index} className={`mobile-message-item ${isCurrentUser ? 'sent' : 'received'}`}>
                    {!isCurrentUser && (
                      <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        src={msg.groupid ? 
                          getObjectByEmail(items, msg.senderid ?? '')?.avatar : 
                          chatPartnerAvatar
                        }
                        className="mobile-message-avatar"
                      />
                    )}
                    <div className={`mobile-message-bubble ${isCurrentUser ? 'sent' : 'received'}`}>
                      {!isCurrentUser && msg.groupid && (
                        <div className="mobile-message-sender">
                          {getObjectByEmail(items, msg.senderid ?? '')?.username}
                        </div>
                      )}
                      <div className="mobile-message-content">
                        {msg.content}
                      </div>
                      <div className="mobile-message-time">
                        {dayjs(msg.sentat).utcOffset(7).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mobile-chat-input">
          <Space size={8}>
            <Tooltip title="Đính kèm file">
              <Upload>
                <Button
                  type="text"
                  icon={<PaperClipOutlined />}
                  className="mobile-attach-btn"
                />
              </Upload>
            </Tooltip>
          </Space>

          <Input
            placeholder="Nhập tin nhắn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onPressEnter={handleSendMessage}
            className="mobile-message-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!messageContent.trim()}
            className="mobile-send-btn"
          >
            Gửi
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-chat-layout">
      <Content className="mobile-content">
        {currentView === 'recent' ? renderRecentChats() : renderChat()}
      </Content>

      <AddFriendModal
        findUser={findUser}
        setFindUser={setFindUser}
        isModalOpen={isAddFriendModalOpen}
        handleCancel={handleCancel}
        handleOpenNotFriendModal={handleOpenNotFriendModal}
      />
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
      />
      <NotFriendModal
        isModalOpen={isNotFriendModalOpen}
        handleCancel={handleCancelNotFriend}
        findUser={findUser}
      />
    </div>
  );
};

export default MobileChatLayout; 