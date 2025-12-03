import React from 'react';
import { Avatar, Typography, Button, Tooltip } from 'antd';
import { UserOutlined, MoreOutlined } from '@ant-design/icons';
import type { UserResponse } from '../interface/UserResponse';

const { Title } = Typography;

interface OnlineUser {
  userId: string;
  user: UserResponse;
}

interface HeadMainProps {
  chatPartner?: UserResponse | null;
  memberCount?: number;
  onlineUsers: OnlineUser[];
}

const HeadMain: React.FC<HeadMainProps> = ({ chatPartner, memberCount, onlineUsers }) => {

  const isUserOnline = (user: UserResponse | null | undefined): boolean => {
    if (!user) return false;
    return onlineUsers.some(onlineUser => onlineUser.userId === user.id.toString());
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid var(--yahoo-border)',
      backgroundColor: 'var(--yahoo-bg)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          size={40} 
          icon={<UserOutlined />} 
          src={chatPartner?.avatar}
          style={{ 
            marginRight: '12px',
            border: '2px solid var(--yahoo-border)'
          }}
        />
        <div>
          <Title level={5} style={{ 
            margin: 0, 
            color: 'var(--yahoo-text)',
            fontWeight: '600'
          }}>
            {chatPartner ? chatPartner.username : 'Chọn một cuộc trò chuyện'}
          </Title>
          <div style={{ 
            fontSize: '13px', 
            color: 'var(--yahoo-text-secondary)',
            marginTop: '2px'
          }}>
            {memberCount && memberCount > 0 ? `Nhóm • ${memberCount} thành viên` : 
               <div className="mobile-chat-status">
               {isUserOnline(chatPartner) ? 'Đang hoạt động' : 'Không hoạt động'}
             </div>
             }
          </div>
        </div>
      </div>
      <div>
        <Tooltip title="Tùy chọn">
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{
              color: 'var(--yahoo-text-secondary)',
              fontSize: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '6px'
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default HeadMain;