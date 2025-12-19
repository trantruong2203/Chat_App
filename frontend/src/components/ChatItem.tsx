import { Avatar, Badge } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { Message } from '../interface/UserResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface ChatItemProps {
    message: Message;
    isSelected: boolean;
    hasUnreadMessage: boolean;
    isUserOnline: boolean;
    chatPartnerName?: string;
    chatPartnerAvatar?: string;
    onClick: (message: Message) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
    message,
    isSelected,
    hasUnreadMessage,
    isUserOnline,
    chatPartnerName,
    chatPartnerAvatar,
    onClick,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
            }}
            onClick={() => onClick(message)}
        >
            <div
                style={{
                    display: 'flex',
                    padding: '12px 16px',
                    backgroundColor: isSelected ? 'var(--yahoo-bg-secondary)' : 'var(--yahoo-bg)',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--yahoo-border)',
                    transition: 'all 0.2s ease',
                    borderLeft: isSelected ? '3px solid var(--yahoo-primary)' : '3px solid transparent',
                }}
                className={`chat-item ${isSelected ? 'selected' : ''}`}
            >
                <Badge dot color={isUserOnline ? 'var(--yahoo-success)' : 'var(--yahoo-text-secondary)'} offset={[-5, 35]}>
                    <Avatar
                        size={42}
                        icon={<SearchOutlined />}
                        src={chatPartnerAvatar}
                        style={{
                            backgroundColor: 'var(--yahoo-bg-secondary)',
                            border: '2px solid var(--yahoo-border)',
                        }}
                    />
                </Badge>
                <div style={{ marginLeft: '12px', flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                            style={{
                                fontWeight: hasUnreadMessage ? '600' : '500',
                                color: hasUnreadMessage ? 'var(--yahoo-text)' : 'var(--yahoo-text-secondary)',
                                fontSize: '14px',
                            }}
                        >
                            {chatPartnerName}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--yahoo-text-secondary)',
                                fontWeight: hasUnreadMessage ? '500' : '400',
                            }}
                        >
                            {dayjs(message.sentat).utcOffset(7).fromNow()}
                        </span>
                    </div>
                    <div
                        style={{
                            fontSize: '13px',
                            color: hasUnreadMessage ? 'var(--yahoo-text)' : 'var(--yahoo-text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '4px',
                            fontWeight: hasUnreadMessage ? '500' : '400',
                        }}
                    >
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ⚡ Bolt: Memoizing ChatItem to prevent unnecessary re-renders of the entire list.
// This component will only re-render if its specific props change,
// significantly improving performance when the parent `RecentChats` component updates.
export default React.memo(ChatItem);
