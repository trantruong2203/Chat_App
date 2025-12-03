import { Layout } from 'antd';
import MenuContacts from '../../components/MenuContacts';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import UserModal from '../../components/modal/UserModal';
import NotFriendModal from '../../components/modal/NotFriendModal';
import AddGroupModal from '../../components/modal/AddGroupModal';
import AddFriendModal from '../../components/modal/AddFriendModal';
import type { UserResponse } from '../../interface/UserResponse';

function Contacts() {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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
        birthday: new Date().toISOString(), // Chuyển từ Date sang string ISO
        agreement: false,
        status: 0,
    });
    const handleCancel = (): void => {
        setIsAddFriendModalOpen(false);
    };

    const handleOpenNotFriendModal = (): void => {
        setIsNotFriendModalOpen(true);
    };

    const handleCancelNotFriend = (): void => {
        setIsNotFriendModalOpen(false);
    };

    return (
        <>
            <Layout style={{ height: '100vh', overflow: 'hidden', background: 'var(--yahoo-bg-secondary)' }}>
                <Layout style={{ display: 'flex', flexDirection: 'row', height: '100%', backgroundColor: 'var(--yahoo-bg)' }}>
                    <div style={{ height: '100%', width: "320px", background: 'var(--yahoo-bg)', borderRight: '1px solid var(--yahoo-border)' }}>
                        <MenuContacts 
                        setIsAddFriendModalOpen={setIsAddFriendModalOpen} 
                        setIsAddGroupModalOpen={setIsAddGroupModalOpen} 
                        />
                    </div>
                    <div style={{ flex: 1, background: 'var(--yahoo-bg-secondary)' }}>
                        <Outlet />
                    </div>
                </Layout>
            </Layout>

            <UserModal
                isModalOpen={isUserModalOpen}
                setIsModalOpen={setIsUserModalOpen}
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

export default Contacts;