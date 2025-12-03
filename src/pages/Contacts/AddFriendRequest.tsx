import { Avatar, Button, Card, Divider, Empty, List, Space, Row, Col } from 'antd';
import { Typography } from 'antd';
import { AiOutlineUserAdd, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { useContext, useState, useEffect } from 'react';
import { ContextAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../stores/store';
import { getObjectByEmail, getObjectById } from '../../services/respone';
import type { FriendShip } from '../../interface/UserResponse';
import { deletedFriendShip, updatedFriendShip } from '../../features/friendship/friendshipThunks';
import { toast } from 'react-toastify';
import { sendMessageThunk, getMessages } from '../../features/messages/messageThunks';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const AddFriendRequest: React.FC = () => {
    const [friendRequests, setFriendRequests] = useState<FriendShip[]>([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState<FriendShip[]>([]);
    const { accountLogin } = useContext(ContextAuth);
    const dispatch = useDispatch<AppDispatch>();
    const friendShip = useSelector((state: RootState) => state.friendship.items);
    const { items } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const getFriendRequests = () => {
            const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
            if (!currentUserId) return [];
            return friendShip.filter(item => item.sentat == currentUserId);
        };
        const requests = getFriendRequests();
        setFriendRequests(requests);

        const getFriendRequestsSent = () => {
            const currentUserId = getObjectById(items, accountLogin?.email ?? '')?.id;
            if (!currentUserId) return [];
            return friendShip.filter(item => item.userid == currentUserId);
        };
        const requestsSent = getFriendRequestsSent();
        setFriendRequestsSent(requestsSent);
    }, [friendShip, items, accountLogin]);


    const handleAcceptFriend = async (friendShip: FriendShip) => {
        try {
            await dispatch(updatedFriendShip({
                id: friendShip?.id ?? 0,
                friendShip: {
                    ...friendShip,
                    status: 0
                }
            }));
    
            await dispatch(sendMessageThunk(
                {
                    id: 0,
                    groupid: null,
                    senderid: friendShip?.userid ?? 0,
                    receiverid:  friendShip?.sentat ?? 0,
                    content: `Bạn và ${getObjectByEmail(items, friendShip?.userid)?.username} đã trở thành bạn bè`,
                    sentat: dayjs().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
                    status: 1,
                    messageid: 0
                } ));
            
            // Cập nhật danh sách tin nhắn ngay sau khi tạo tin nhắn thành công
            await dispatch(getMessages());
            toast.success('Chấp nhận lời mời kết bạn thành công');

        } catch {
            toast.error('Chấp nhận lời mời kết bạn thất bại');
        }
    };

    const handleRejectFriend = async (id: number) => {
        try {
            await dispatch(deletedFriendShip(id));
            toast.success('Từ chối lời mời kết bạn thành công');
        } catch (error) {
            console.error('Lỗi khi xóa lời mời kết bạn:', error);
            toast.error('Từ chối lời mời kết bạn thất bại');
        }
    };

    return (
        <div
            style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                padding: '25px',
                backgroundColor: '#fff',
                overflowY: 'auto',
            }}
        >
            <div style={{ padding: '0 10px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                    }}
                >
                    <AiOutlineUserAdd style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Typography.Title level={3} style={{ margin: '0', color: '#1890ff' }}>
                        Lời mời kết bạn
                    </Typography.Title>
                </div>



                {friendRequests.filter(item => item.status == 1).length > 0 ? (
                    <>
                        <Typography.Title level={4} style={{ margin: '15px 0', color: '#333' }}>
                            Lời mời đã nhận ({friendRequests.filter(item => item.status == 1).length})
                        </Typography.Title>
                        <Divider style={{ margin: '15px 0' }} />
                        <List
                            itemLayout="vertical"
                            dataSource={friendRequests}
                            renderItem={(request) => {
                                const senderUser = getObjectByEmail(items, request.userid);

                                return (
                                    <List.Item style={{ padding: '16px 0' }}>
                                        {request.status == 1 ? (
                                            <Card
                                                hoverable
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                }}
                                                bodyStyle={{ padding: '16px' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <Avatar size={50} src={senderUser?.avatar} />
                                                        <div>
                                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                                {senderUser?.username ?? 'Không rõ'}
                                                            </Typography.Title>
                                                            <Typography.Text type="secondary">{senderUser?.email ?? '---'}</Typography.Text>
                                                        </div>
                                                    </div>
                                                    <Space>
                                                        <Button
                                                            type="primary"
                                                            icon={<AiOutlineCheck />}
                                                            size="middle"
                                                            style={{ borderRadius: '8px' }}
                                                            onClick={() => handleAcceptFriend(request)}
                                                        >
                                                            Chấp nhận
                                                        </Button>
                                                        <Button
                                                            danger
                                                            icon={<AiOutlineClose />}
                                                            size="middle"
                                                            style={{ borderRadius: '8px' }}
                                                            onClick={() => handleRejectFriend(request.id)}
                                                        >
                                                            Từ chối
                                                        </Button>
                                                    </Space>
                                                </div>
                                            </Card>
                                        ) : (
                                            ""
                                        )}
                                    </List.Item>
                                );
                            }}
                        />
                    </>
                ) : (
                    <Empty description="Không có lời mời kết bạn nào" style={{ margin: '40px 0' }} />
                )}
            </div>

            <div style={{ padding: '0 10px' }}>

                {friendRequestsSent.filter(item => item.status == 1).length > 0 ? (
                    <>
                        <Typography.Title level={4} style={{ margin: '15px 0', color: '#333' }}>
                            Lời mời đã gửi ({friendRequestsSent.filter(item => item.status == 1).length})
                        </Typography.Title>

                        <Divider style={{ margin: '15px 0' }} />

                        <Row gutter={[16, 16]}>
                            {friendRequestsSent.map((request) => {
                                if (request.status !== 1) return null;
                                const senderUser = getObjectByEmail(items, request.sentat);
                                return (
                                    <Col xs={24} sm={12} md={8} key={request.id}>
                                        <Card
                                            hoverable
                                            style={{
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            }}
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                                <Avatar size={64} src={senderUser?.avatar} style={{ marginBottom: '10px' }} />
                                                <Typography.Title level={5} style={{ margin: '0 0 5px 0' }}>
                                                    {senderUser?.username ?? 'Không rõ'}
                                                </Typography.Title>
                                                <Typography.Text type="secondary" style={{ fontSize: '12px', marginBottom: '10px' }}>
                                                    Bạn đã gửi lời mời
                                                </Typography.Text>
                                                <Button
                                                    danger
                                                    icon={<AiOutlineClose />}
                                                    size="middle"
                                                    style={{ borderRadius: '8px', width: '100%' }}
                                                    onClick={() => handleRejectFriend(request.id)}
                                                >
                                                    Thu hồi lời mời
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </>
                ) : (
                    <>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddFriendRequest;
