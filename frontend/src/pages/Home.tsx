import  { useState } from 'react';
import ClientRouter from '../routers/ClientRouter';
import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import UserModal from '../components/modal/UserModal';

function Home() {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    return (
        <div>
            <Layout style={{ height: '100vh', overflow: 'hidden', background: 'var(--yahoo-bg-secondary)' }}>
                <Layout style={{ display: 'flex', flexDirection: 'row', height: '100%', backgroundColor: 'var(--yahoo-bg)' }}>
                    <Navbar setIsUserModalOpen={setIsUserModalOpen}  />
                    <ClientRouter />
                </Layout>
            </Layout>
            <MobileNavbar />
            <UserModal
                isModalOpen={isUserModalOpen}
                setIsModalOpen={setIsUserModalOpen}
            />

        </div>
    );
}

export default Home;