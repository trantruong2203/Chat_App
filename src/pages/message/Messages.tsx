import { Layout } from 'antd';
import Main from '../../components/Main';
import RecentChats from '../../components/RecentChats';
import MobileChatLayout from '../../components/MobileChatLayout';
import AddFriendModal from '../../components/modal/AddFriendModal';
import AddGroupModal from '../../components/modal/AddGroupModal';
import NotFriendModal from '../../components/modal/NotFriendModal';
import { useState, useContext, useEffect } from 'react';
import type { UserResponse, Message } from '../../interface/UserResponse';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../stores/store';
import { ContextAuth } from '../../contexts/AuthContext';
import { getObjectById } from '../../services/respone';
import { sendMessageThunk } from '../../features/messages/messageThunks';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import dayjs from 'dayjs';
dayjs.locale('vi');

import { fetchLastMessagesByUserIdThunk } from '../../features/messages/messageThunks';
import { io, Socket } from 'socket.io-client';
import { useResponsive } from '../../hooks/useResponsive';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

// Interface cho user online
interface OnlineUser {
    userId: string;
    user: UserResponse;
}

function Messages() {
    const [isNotFriendModalOpen, setIsNotFriendModalOpen] = useState(false);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [fullMessages, setFullMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { items } = useSelector((state: RootState) => state.user);
    const { accountLogin } = useContext(ContextAuth);
    const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
    const { id } = useParams();
    const groupMember = useSelector((state: RootState) => state.groupMember.items);
    const lastMessages = useSelector((state: RootState) => state.message.lastMessages);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const isGroupChat = window.location.pathname.includes('/group/');
    const userId = isGroupChat ? null : id;
    const groupId = isGroupChat ? id : null;
    const [handleLastMess, setHandleLastMess] = useState<Message | null>(null);
    const { isMobile } = useResponsive();
    const [loading, setLoading] = useState(false);

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
    }

    const handleOpenNotFriendModal = (): void => {
        setIsNotFriendModalOpen(true);
    };

    const handleCancelNotFriend = (): void => {
        setIsNotFriendModalOpen(false);
    };

    useEffect(() => {
        // Kết nối socket
        const newSocket = io(SOCKET_URL, {
          withCredentials: true
        });
    
        newSocket.on('loadMessages', (loadedMessages: Message[]) => {
          if (Array.isArray(loadedMessages)) {
            setMessages(loadedMessages.map(msg => ({
              id: msg.id || 0,
              content: msg.content || 'Tin nhắn không hợp lệ',
              senderid: msg.senderid || 0,
              receiverid: msg.receiverid || 0,
              sentat: msg.sentat || dayjs().locale('vi').format('YYYY-MM-DD HH:mm:ss'),
              status: msg.status || 1,
              messageid: msg.messageid || 0,
              groupid: msg.groupid || 0,
            })));
          }
        });
    
        newSocket.on('receiveMessage', (data: Message) => {
          const newMessage: Message = {
            id: 0,
            content: data.content || 'Tin nhắn không hợp lệ',
            senderid: data.senderid || 0,
            receiverid: data.receiverid || 0,
            sentat: data.sentat || dayjs().locale('vi').format('YYYY-MM-DD HH:mm:ss'),
            status: data.status || 1,
            messageid: data.messageid || 0,
            groupid: data.groupid || 0,
          };
          setMessages(prev => [...prev, newMessage]);
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

  useEffect(() => {
    if (handleLastMess) {
        handleMessageSelection();
    }
  }, [handleLastMess,messages]);


    const handleMessageSelection = () => {
         
        if (!currentUserId) return;
        const chatGroupId = handleLastMess?.groupid;
        const chatPartnerId = handleLastMess?.senderid === currentUserId ? handleLastMess?.receiverid : handleLastMess?.senderid;
        if (chatGroupId) {
            groupMember.some(item => item.userid === currentUserId && item.groupid === chatGroupId);
            const filteredMessages = messages.filter(message =>
                message.groupid === chatGroupId
            );
            setFullMessages(filteredMessages.sort((a, b) => new Date(a.sentat).getTime() - new Date(b.sentat).getTime()));
        } else {
            const filteredMessages = messages.filter(message =>
                (message.senderid === currentUserId && message.receiverid === chatPartnerId) ||
                (message.receiverid === currentUserId && message.senderid === chatPartnerId)
            );
            setFullMessages(filteredMessages.sort((a, b) => new Date(a.sentat).getTime() - new Date(b.sentat).getTime()));
        };
        setSelectedMessage({
            id: handleLastMess?.id || 0,
            content: handleLastMess?.content || '',
            senderid: currentUserId,
            receiverid: chatPartnerId ?? null,
            sentat: handleLastMess?.sentat || dayjs().locale('vi').format('YYYY-MM-DD HH:mm:ss'),
            status: handleLastMess?.status || 1,
            messageid: handleLastMess?.messageid || 0,
            groupid: chatGroupId ?? null
        });
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
                sentat: dayjs().locale('vi').format('YYYY-MM-DD HH:mm:ss'),
                status: 1,
                messageid: 0
            };

            setLoading(true);
            await dispatch(sendMessageThunk(newMessage)).unwrap();
            setLoading(false);
            setMessageContent('');
            const filteredMessages = messages.filter(message =>
                (message.senderid === currentUserId && message.receiverid === chatPartnerId) ||
                (message.receiverid === currentUserId && message.senderid === chatPartnerId) ||
                (message.groupid === groupId)
            ).sort((a, b) => new Date(a.sentat).getTime() - new Date(b.sentat).getTime());
            if (filteredMessages.length > 0) {
                setFullMessages(filteredMessages);
                dispatch(fetchLastMessagesByUserIdThunk(currentUserId));

            }
            setSelectedMessage({
                ...newMessage,
                senderid: currentUserId,
                receiverid: chatPartnerId || null,
                groupid: groupId || null
            });
        } catch (error: unknown) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            message.error(`Lỗi: ${error instanceof Error ? error.message : 'Không xác định'}`);
        }
    };

    useEffect(() => {
        if (groupId && currentUserId && messages.length > 0) {
            const groupIdNumber = parseInt(groupId);
            const firstGroupMessage = messages.find(message => message.groupid === groupIdNumber);
            if (firstGroupMessage) {
                setHandleLastMess(firstGroupMessage);
            }
        } else if (userId && currentUserId && messages.length > 0) {
            const userIdNumber = parseInt(userId);
            const firstPersonalMessage = messages.find(message =>
                (message.senderid === currentUserId && message.receiverid === userIdNumber) ||
                (message.receiverid === currentUserId && message.senderid === userIdNumber)
            );
            if (firstPersonalMessage) {
                setHandleLastMess(firstPersonalMessage);
            }
        }
    }, [userId, groupId, currentUserId, messages]);

    // Nếu là mobile, sử dụng MobileChatLayout
    if (isMobile) {
        return (
            <>
                <MobileChatLayout
                    socket={socket}
                    onlineUsers={onlineUsers}
                />

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
            </>
        );
    }

    // Nếu là desktop, sử dụng layout cũ
    return (
        <>
            <Layout style={{ height: '100vh', overflow: 'hidden', background: 'var(--yahoo-bg-secondary)' }}>
                <Layout style={{ display: 'flex', flexDirection: 'row', height: '100%', backgroundColor: 'var(--yahoo-bg)' }}>
                    <div style={{ height: '100%', width: "320px" }}>
                        <RecentChats
                            setIsAddFriendModalOpen={setIsAddFriendModalOpen}
                            setIsAddGroupModalOpen={setIsAddGroupModalOpen}
                            selectedMessage={selectedMessage}
                            lastMessages={lastMessages}
                            setHandleLastMess={setHandleLastMess}
                            socket={socket}
                            onlineUsers={onlineUsers}
                        />
                    </div>
                    <Main
                        message={messageContent}
                        setMessage={setMessageContent}
                        handleSendMessage={handleSendMessage}
                        fullMessages={fullMessages}
                        handleMessageSelection={handleMessageSelection}
                        groupMember={groupMember}
                        onlineUsers={onlineUsers}
                        loading={loading}
                    />
                </Layout>
            </Layout>


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


        </>

    );
}

export default Messages;