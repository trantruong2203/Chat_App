import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Layout, Input, Button, Space, Empty, Upload, Tooltip } from 'antd';
import { UserOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import HeadMain from './HeadMain';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getObjectById, getObjectByEmail } from '../services/respone';
import { ContextAuth } from '../contexts/AuthContext';
import type { Message, UserResponse, GroupMember } from '../interface/UserResponse';
import dayjs from 'dayjs';

const { Content } = Layout;

interface OnlineUser {
  userId: string;
  user: UserResponse;
}

interface MainProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleMessageSelection: (message: Message) => void;
  fullMessages: Message[];
  groupMember: GroupMember[];
  onlineUsers: OnlineUser[];
  loading: boolean;
}

const Main: React.FC<MainProps> = ({ message, setMessage, handleSendMessage, fullMessages, handleMessageSelection, groupMember, onlineUsers, loading }) => {
  const { items } = useSelector((state: RootState) => state.user);
  const { accountLogin } = useContext(ContextAuth);
  const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatPartner, setChatPartner] = useState<UserResponse | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const chatGroup = useSelector((state: RootState) => state.chatGroup.items);
  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (fullMessages.length === 0 || !currentUserId) return;
    
    const lastMessage = fullMessages[fullMessages.length - 1];
         if(lastMessage.groupid){
       // Lấy thông tin về nhóm chat
       const group = chatGroup.find(item => item.id === lastMessage.groupid);
       
               // Đếm số thành viên trong nhóm và lưu vào state
        const count = groupMember.filter(member => member.groupid === lastMessage.groupid).length;
        setMemberCount(count);
        
        // Thiết lập thông tin hiển thị
        if (group) {
          setChatPartner({
            ...group,
            username: group.name,
            email: '',
            password: '',
            confirm: '',
            phone: '',
            gender: '',
            birthday: '',
            agreement: false,
            status: 1,
          });
       } 
          } else {
        // Đặt số lượng thành viên về 0 cho tin nhắn cá nhân
        setMemberCount(0);
        
        const chatPartnerId = lastMessage.senderid === currentUserId ? 
        lastMessage.receiverid : lastMessage.senderid;

        const partner = getObjectByEmail(items, chatPartnerId ?? '');
        
        if (partner) {
          setChatPartner(partner);
        }
      }
  }, [fullMessages, currentUserId, items, groupMember, chatGroup]);

  return (
    <Content className="chat-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', background: 'var(--yahoo-bg)', minHeight: '100vh' }}>
      {chatPartner && <HeadMain chatPartner={chatPartner} memberCount={memberCount} onlineUsers={onlineUsers} />}

      <Space
        direction="vertical"
        style={{
          padding: '20px',
          flex: 1,
          overflowY: 'auto',
          width: '100%',
          background: 'var(--yahoo-bg-secondary)',
          minHeight: 0
        }}
        size={16}
      >
        {fullMessages.length === 0 ? (
          <div style={{marginTop: '100px', textAlign: 'center' }}>
            <Empty 
              description="Chọn một cuộc trò chuyện để bắt đầu" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <>
            {fullMessages.map((msg, index) => {
              const isCurrentUser = msg.senderid === currentUserId;
              return (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                  alignItems: 'flex-end'
                }}>
                  {!isCurrentUser && (
                    <Avatar
                      size={36}
                      icon={<UserOutlined />}
                      src={msg.groupid ? 
                        getObjectByEmail(items, msg.senderid ?? '')?.avatar : 
                        chatPartner?.avatar
                      }
                      style={{ 
                        backgroundColor: 'var(--yahoo-bg-secondary)', 
                        marginRight: '10px',
                        border: '2px solid var(--yahoo-border)'
                      }}
                    />
                  )}
                  <div className={isCurrentUser ? "message-bubble-sent" : "message-bubble-received"}>
                    {currentUserId == msg.senderid ?
                    (
                      <div>

                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--yahoo-text-secondary)', marginBottom: '4px' }}>
                        {getObjectByEmail(items, msg.senderid ?? '')?.username}
                      </div>
                    )}
                    <div style={{ padding: '0', margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                      {msg.content}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : 'var(--yahoo-text-secondary)',
                      marginTop: '6px',
                      textAlign: 'right'
                    }}>
                      {dayjs(msg.sentat).utcOffset(7).format('HH:mm')}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </Space>

      <div
        style={{
          padding: '16px',
          backgroundColor: 'var(--yahoo-bg)',
          borderTop: '1px solid var(--yahoo-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Space size={8}>
          {/* Đã gỡ nút emoji */}
          <Tooltip title="Đính kèm file">
            <Upload>
              <Button
                type="text"
                style={{ 
                  color: 'var(--yahoo-text-secondary)', 
                  fontSize: '18px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px'
                }}
                icon={<PaperClipOutlined />}
              />
            </Upload>
          </Tooltip>
        </Space>

        <Input
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSendMessage}
          disabled={!handleMessageSelection}
          style={{
            flex: 1,
            border: '1px solid var(--yahoo-border)',
            borderRadius: '8px',
            backgroundColor: 'var(--yahoo-bg)',
            padding: '8px 12px',
            fontSize: '14px'
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={handleSendMessage}
          disabled={!handleMessageSelection || !message.trim()}
          style={{
            background: 'var(--yahoo-primary)',
            borderColor: 'var(--yahoo-primary)',
            borderRadius: '8px',
            height: '40px',
            padding: '0 16px'
          }}
        >
          Gửi
        </Button>
      </div>

    </Content>
  );
};

export default Main; 