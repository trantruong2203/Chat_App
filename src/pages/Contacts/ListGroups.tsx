import { Divider, List, Avatar, Typography, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { getObjectById } from '../../services/respone';
import { ContextAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import type { ChatGroup } from '../../interface/UserResponse';
import { useNavigate } from 'react-router-dom';

const ListGroups: React.FC = () => {
    const { items } = useSelector((state: RootState) => state.user);
    const chatGroup = useSelector((state: RootState) => state.chatGroup.items);
    const { accountLogin } = useContext(ContextAuth);
    const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
    const [searchText, setSearchText] = useState('');
    const [groups, setGroups] = useState<ChatGroup[]>([]);
    const groupMembers = useSelector((state: RootState) => state.groupMember.items);
    const navigate = useNavigate();

    useEffect(() => {
        const getGroup = () => {
            if (!currentUserId) return [];
            
            const groups = chatGroup.filter(groupItem => {
                return groupMembers.some(member => member.groupid === groupItem.id && member.userid === currentUserId );
            });
            const groupsWithMembers = groups.map(group => {
                return {
                    ...group,
                    members: groupMembers.filter(member => member.groupid === group.id)
                }
            });
            return groupsWithMembers;
        }
        setGroups(getGroup());
    }, [searchText, items, chatGroup, currentUserId, groupMembers]);

    const handleGroupClick = (group: ChatGroup) => {
      navigate(`/group/${group.id}`);   
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
          <Typography.Title level={4} style={{ margin: "10px 0" }}>Danh sách nhóm</Typography.Title>
        </div>

        <Input
          placeholder="Tìm kiếm nhóm..."
          allowClear
          size="large"
          style={{ marginBottom: '20px' }}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Divider style={{ margin: '10px 0' }} />

        <List
          dataSource={groups}
          renderItem={item => {
            return (
            <List.Item
              style={{
                padding: '12px 5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                borderRadius: '8px'
              }}
              className="contact-item"
              onClick={() => handleGroupClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <List.Item.Meta
                avatar={
                    <Avatar
                      src={item.avatar ?? ''}
                      size={50}
                      style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                    />
                }
                title={<Typography.Text strong style={{fontSize: '18px'}}>{item.name ?? '---'}</Typography.Text>}
              />
            </List.Item>
          )}}
        />
      </div>
    </div>
    );
};

export default ListGroups;