import { Input, type GetProps, Tooltip } from 'antd';
import React from 'react';
import { SearchOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { AiOutlineTeam, AiOutlineUser, AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

interface MenuContactsProps {
    setIsAddFriendModalOpen: (isAddFriendModalOpen: boolean) => void;
    setIsAddGroupModalOpen: (isAddGroupModalOpen: boolean) => void;
    }

function MenuContacts({ setIsAddFriendModalOpen, setIsAddGroupModalOpen }: MenuContactsProps): React.ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    // Style chung cho các menu item
    const menuItemStyle = {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: '15px',
        padding: '14px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        margin: '4px 0',
        cursor: 'pointer',
    };

    // Kiểm tra item nào đang active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="navbar-contacts-container" style={{ 
            padding: '16px', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            width: '320px',
            backgroundColor: 'var(--yahoo-bg)',
        }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                gap: '12px', 
                alignItems: 'center', 
                padding: '0 0 20px 0',
                borderBottom: '1px solid var(--yahoo-border)'
            }}>
                <Search 
                    placeholder="Tìm kiếm liên hệ..." 
                    allowClear 
                    onSearch={onSearch} 
                    prefix={<SearchOutlined style={{ color: 'var(--yahoo-text-secondary)' }} />}
                    style={{ 
                        width: '100%',
                        borderRadius: '8px',
                    }} 
                />
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '8px' 
                }}>
                    <Tooltip title="Thêm bạn bè">
                        <div className="icon-btn" style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: 'var(--yahoo-text-secondary)',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            backgroundColor: 'var(--yahoo-bg-secondary)',
                            transition: 'all 0.2s ease',
                        }} 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--yahoo-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)'}
                        onClick={() => setIsAddFriendModalOpen(true)}>
                            <UserAddOutlined />
                        </div>
                    </Tooltip>
                    <Tooltip title="Tạo nhóm">
                        <div className="icon-btn" style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: 'var(--yahoo-text-secondary)',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            backgroundColor: 'var(--yahoo-bg-secondary)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--yahoo-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)'}
                        onClick={() => setIsAddGroupModalOpen(true)}>
                            <UsergroupAddOutlined />
                        </div>
                    </Tooltip>
                </div>
            </div>
            
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'auto',
                height: '100%',
                padding: '16px 0',
            }}>
                <div style={{ 
                    display: 'flex', 
                    backgroundColor: 'var(--yahoo-bg)', 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    flexDirection: 'column',
                    padding: '12px',
                    border: '1px solid var(--yahoo-border)'
                }}> 
                    <div 
                        style={{
                            ...menuItemStyle,
                            backgroundColor: isActive('/contacts') ? 'var(--yahoo-primary)' : 'transparent',
                            color: isActive('/contacts') ? 'white' : 'var(--yahoo-text)',
                        }}
                        onMouseEnter={(e) => !isActive('/contacts') && (e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)')} 
                        onMouseLeave={(e) => !isActive('/contacts') && (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => {
                            navigate('/contacts');
                        }}
                    >
                        <AiOutlineUser style={{ fontSize: '22px' }} />
                        <p style={{ fontSize: '15px', margin: 0, fontWeight: isActive('/contacts/list-contacts') ? '600' : '500' }}>Danh sách bạn bè</p>
                    </div>
                    
                    <div 
                        style={{
                            ...menuItemStyle,
                            backgroundColor: isActive('/contacts/list-groups') ? 'var(--yahoo-primary)' : 'transparent',
                            color: isActive('/contacts/list-groups') ? 'white' : 'var(--yahoo-text)',
                        }}
                        onMouseEnter={(e) => !isActive('/contacts/list-groups') && (e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)')}
                        onMouseLeave={(e) => !isActive('/contacts/list-groups') && (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/contacts/list-groups')}
                    >
                        <AiOutlineTeam style={{ fontSize: '22px' }} />
                        <p style={{ fontSize: '15px', margin: 0, fontWeight: isActive('/contacts/list-groups') ? '600' : '500' }}>Danh sách nhóm</p>
                    </div>

                    <div 
                        style={{
                            ...menuItemStyle,
                            backgroundColor: isActive('/contacts/add-friend-request') ? 'var(--yahoo-primary)' : 'transparent',
                            color: isActive('/contacts/add-friend-request') ? 'white' : 'var(--yahoo-text)',
                        }}
                        onMouseEnter={(e) => !isActive('/contacts/add-friend-request') && (e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)')}
                        onMouseLeave={(e) => !isActive('/contacts/add-friend-request') && (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/contacts/add-friend-request')}
                    >
                        <AiOutlineUserAdd style={{ fontSize: '22px' }} />
                        <p style={{ fontSize: '15px', margin: 0, fontWeight: isActive('/contacts/add-friend-request') ? '600' : '500' }}>Lời mời kết bạn</p>
                    </div>

                    <div 
                        style={{
                            ...menuItemStyle,
                            backgroundColor: isActive('/contacts/add-group-request') ? 'var(--yahoo-primary)' : 'transparent',
                            color: isActive('/contacts/add-group-request') ? 'white' : 'var(--yahoo-text)',
                        }}
                        onMouseEnter={(e) => !isActive('/contacts/add-group-request') && (e.currentTarget.style.backgroundColor = 'var(--yahoo-bg-secondary)')}
                        onMouseLeave={(e) => !isActive('/contacts/add-group-request') && (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/contacts/add-group-request')}
                    >
                        <AiOutlineUsergroupAdd style={{ fontSize: '22px' }} />
                        <p style={{ fontSize: '15px', margin: 0, fontWeight: isActive('/contacts/add-group-request') ? '600' : '500' }}>Lời mời tham gia nhóm</p>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default MenuContacts;