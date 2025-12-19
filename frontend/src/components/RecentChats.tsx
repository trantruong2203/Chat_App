import { Input, type GetProps, Tooltip } from 'antd';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { SearchOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../stores/store';
import { ContextAuth } from '../contexts/AuthContext';
import type { Message, ChatGroup, UserResponse } from '../interface/UserResponse';
import { getObjectByEmail, getObjectById } from '../services/respone';
import 'dayjs/locale/vi';
import { fetchLastMessagesByUserIdThunk } from '../features/messages/messageThunks';
import { Socket } from 'socket.io-client';
import ChatItem from './ChatItem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('vi');

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

interface OnlineUser {
    userId: string;
    user: UserResponse;
}

interface RecentChatsProps {
    setIsAddFriendModalOpen: (isAddFriendModalOpen: boolean) => void;
    setIsAddGroupModalOpen: (isAddGroupModalOpen: boolean) => void;
    selectedMessage: Message | null;
    lastMessages: Message[];
    setHandleLastMess: (handleLastMess: Message | null) => void;
    socket: Socket | null;
    onlineUsers: OnlineUser[];
}

function RecentChats({ setIsAddFriendModalOpen, setIsAddGroupModalOpen, selectedMessage, lastMessages, setHandleLastMess, socket, onlineUsers }: RecentChatsProps): React.ReactElement {

    const { items } = useSelector((state: RootState) => state.user);
    const { accountLogin } = useContext(ContextAuth);
    const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
    const chatGroup = useSelector((state: RootState) => state.chatGroup.items as ChatGroup[]);
    const dispatch = useDispatch<AppDispatch>();
    const [unreadMessages, setUnreadMessages] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!accountLogin || !currentUserId) return;
        dispatch(fetchLastMessagesByUserIdThunk(currentUserId));
    }, [accountLogin, currentUserId, dispatch]);

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handleReceiveMessage = (newMessage: Message) => {
            if (newMessage.senderid === currentUserId || newMessage.receiverid === currentUserId || newMessage.groupid) {
                dispatch(fetchLastMessagesByUserIdThunk(currentUserId));

                if (newMessage.senderid !== currentUserId) {
                    const conversationKey = newMessage.groupid
                        ? `group-${newMessage.groupid}`
                        : `user-${newMessage.senderid}-${newMessage.receiverid}`;
                    setUnreadMessages(prev => new Set(prev).add(conversationKey));
                }
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket, currentUserId, dispatch]);

    const getChatPartnerName = (message: Message): string | undefined => {
        if (message.groupid) {
            const group = chatGroup.find((group) => group.id === message.groupid);
            return group?.name;
        }
        return getObjectByEmail(items, message.receiverid === currentUserId ? message.senderid : message.receiverid ?? 0)?.username;
    }

    const getChatPartnerAvatar = (message: Message): string | undefined => {
        if (message.groupid) {
            const group = chatGroup.find((group) => group.id === message.groupid);
            return group?.avatar;
        }
        return getObjectByEmail(items, message.receiverid === currentUserId ? message.senderid : message.receiverid ?? 0)?.avatar;
    }

    const isUserOnline = (message: Message): boolean => {
        const partnerId = message.receiverid == currentUserId ? message.senderid : message.receiverid;
        return onlineUsers.some(onlineUser => onlineUser.user.id == partnerId);
    };

    const handleChatItemClick = useCallback((message: Message) => {
        setHandleLastMess(message);
        const conversationKey = message.groupid
            ? `group-${message.groupid}`
            : `user-${message.senderid}-${message.receiverid}`;
        setUnreadMessages(prev => {
            if (!prev.has(conversationKey)) {
                return prev;
            }
            const newSet = new Set(prev);
            newSet.delete(conversationKey);
            return newSet;
        });
    }, [setHandleLastMess]);


    return (
        <div className="recent-chats-container" style={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '320px',
            background: 'var(--yahoo-bg)',
            borderRight: '1px solid var(--yahoo-border)',
            minWidth: '280px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: '10px',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid var(--yahoo-border)',
                background: 'var(--yahoo-bg)'
            }}>
                <Search
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    allowClear
                    onSearch={onSearch}
                    prefix={<SearchOutlined style={{ color: 'var(--yahoo-text-secondary)' }} />}
                    style={{
                        width: '100%',
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
                            padding: '8px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                        }}>
                            <UserAddOutlined onClick={() => setIsAddFriendModalOpen(true)} />
                        </div>
                    </Tooltip>
                    <Tooltip title="Tạo nhóm">
                        <div className="icon-btn" style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: 'var(--yahoo-text-secondary)',
                            padding: '8px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                        }}>
                            <UsergroupAddOutlined onClick={() => setIsAddGroupModalOpen(true)} />
                        </div>
                    </Tooltip>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                height: '100%',
                background: 'var(--yahoo-bg)'
            }}>
                {lastMessages.map((message: Message) => {
                    let isSelected = false;
                    
                    if (selectedMessage) {
                        const getConversationKey = (msg: Message) => {
                            if (msg.groupid) {
                                return `group-${msg.groupid}`;
                            } else {
                                const partnerId = msg.senderid === currentUserId ? msg.receiverid : msg.senderid;
                                return `user-${currentUserId}-${partnerId}`;
                            }
                        };
                        
                        const currentConversationKey = getConversationKey(message);
                        const selectedConversationKey = getConversationKey(selectedMessage);
                        
                        isSelected = currentConversationKey === selectedConversationKey;
                    }

                    const conversationKey = message.groupid 
                        ? `group-${message.groupid}` 
                        : `user-${message.senderid}-${message.receiverid}`;
                    const hasUnreadMessage = unreadMessages.has(conversationKey);
                    const chatPartnerName = getChatPartnerName(message);
                    const chatPartnerAvatar = getChatPartnerAvatar(message);
                    const online = isUserOnline(message);

                    return (
                        <ChatItem
                            key={`${message.groupid ? `group-${message.groupid}` : `user-${message.senderid}-${message.receiverid}`}-${message.sentat}`}
                            message={message}
                            isSelected={isSelected}
                            hasUnreadMessage={hasUnreadMessage}
                            isUserOnline={online}
                            chatPartnerName={chatPartnerName}
                            chatPartnerAvatar={chatPartnerAvatar}
                            onClick={handleChatItemClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default RecentChats;
