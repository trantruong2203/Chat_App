import React from 'react';
import {
  Layout,
  Avatar,
  Button,
  List,
  Typography,
  Badge,
  Space,
} from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { getObjectByEmail } from '../../services/respone';
import type { UserResponse } from '../../interface/UserResponse';

const { Sider } = Layout;
const { Title } = Typography;

interface ContactsSidebarProps {
  contacts: number[];
  loading?: boolean;
  users: UserResponse[];
}

const ContactsSidebar: React.FC<ContactsSidebarProps> = React.memo(({
  contacts,
  users,
  loading = false
}) => {
  return (
    <Sider
      width={300}
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 0px)',
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#f0f2f5',
        padding: '20px 10px',
      }}
      theme="light"
    >
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          padding: '0 5px'
        }}>
          <Title level={5} style={{ margin: 0 }}>Người liên hệ</Title>
          <Space>
            <Button type="text" shape="circle" icon={<SearchOutlined />} size="small" />
            <Button type="text" shape="circle" icon={<MoreOutlined />} size="small" />
          </Space>
        </div>

        <List
          loading={loading}
          dataSource={contacts}
          renderItem={(contactId: number) => {
            const friendInfo = getObjectByEmail(users, contactId);

            return (
              <List.Item
                style={{
                  padding: '8px 5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  marginBottom: '2px'
                }}
                className="contact-item"
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      status={friendInfo?.status === 1 ? 'success' : 'default'}
                      offset={[0, 28]}
                    >
                      <Avatar src={friendInfo?.avatar} size={36} />
                    </Badge>
                  }
                  title={
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                      {friendInfo?.username || 'Người dùng'}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
    </Sider>
  );
});

ContactsSidebar.displayName = 'ContactsSidebar';

export default ContactsSidebar;