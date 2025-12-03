import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Modal, Divider, Typography, Card, Descriptions, Row, Col, Input, Form, Select, DatePicker, App } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../stores/store';
import { ContextAuth } from '../../contexts/AuthContext';
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  CalendarOutlined,
  CameraOutlined
} from '@ant-design/icons';
import '../../App.css';
import { getObjectById } from '../../services/respone';
import type { UserResponse } from '../../interface/UserResponse';
import { updateUserThunk } from '../../features/users/userThunks';
import dayjs from 'dayjs';
import { setUser } from '../../features/users/userSlice';
import UpdateAvatarModel from './UpdateAvatarModal';

const { Title } = Typography;

const UserModal: React.FC<{ isModalOpen: boolean, setIsModalOpen: (isModalOpen: boolean) => void }> = ({ isModalOpen, setIsModalOpen }) => {

  const { items } = useSelector((state: RootState) => state.user);
  const { accountLogin } = useContext(ContextAuth);
  const { logout } = useContext(ContextAuth);
  const [handleInput, setHandleInput] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [openUpdateAvatar, setOpenUpdateAvatar] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const { message } = App.useApp(); // ✅ lấy message từ context

  useEffect(() => {
    if (accountLogin) {
      dispatch(setUser(getObjectById(items, accountLogin.email) || null));
    }
  }, [accountLogin, items, dispatch]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setHandleInput(false);

  };

  const handleOpenUpdateAvatar = () => {
    setOpenUpdateAvatar(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      const updatePayload: Partial<UserResponse> = {};

      if (values.gender !== user?.gender) updatePayload.gender = values.gender;
      if (values.birthday) {
        const newBirthday = values.birthday.format('YYYY-MM-DD');
        if (newBirthday !== user?.birthday) {
          updatePayload.birthday = newBirthday;
        }
      }
      if (values.username !== user?.username) updatePayload.username = values.username;
      if (values.phone !== user?.phone) updatePayload.phone = values.phone;

      if (Object.keys(updatePayload).length === 0) {
        message.info('Không có thông tin nào thay đổi');
        return;
      }

      await dispatch(updateUserThunk({ email: user?.email || '', account: updatePayload as UserResponse })).unwrap();
      if (user) {
        dispatch(setUser({
          ...user,
          ...updatePayload
        }));
      }
      message.success('Cập nhật thông tin thành công');
      setHandleInput(false);
    } catch (error) {
      message.error('Cập nhật thông tin thất bại: ' + error);
      console.log(error);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Thông tin tài khoản</Title>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={500}
      footer={null}
    style={{ top: 20 }}
    >
      <Card >
        <div style={{ position: 'relative', height: '150px', marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '150px',
            overflow: 'hidden',
            borderRadius: '8px',
            position: 'relative',
          }}>
            <img
              src="https://cdn.pixabay.com/photo/2023/12/06/21/07/photo-8434386_1280.jpg"
              alt="Ảnh bìa"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>

            <div style={{ position: 'relative' }}>
              <Avatar
                size={80}
                src={user?.avatar || ''}
                icon={<UserOutlined />}
                style={{
                  border: '4px solid white',
                  backgroundColor: '#1890ff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                style={{
                  position: 'absolute',
                  right: '0px',
                  bottom: '10px',
                }}
                onClick={handleOpenUpdateAvatar}
              />


            </div>

            <Title level={4} style={{ marginTop: '10px', marginBottom: 0 }}>
              {user?.username || 'Người dùng'}
            </Title>
          </div>
        </div>

        <Divider style={{ marginTop: '30px' }} />
        {handleInput ? (
          <Form 
            form={form} 
            style={{ marginBottom: '20px' }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
          >
            <Form.Item label="Tên người dùng" name="username" initialValue={user?.username}>
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Email" name="email" initialValue={user?.email}>
              <Input disabled style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" initialValue={user?.phone}>
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender" initialValue={user?.gender}>
              <Select style={{ width: '100%' }}>
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ngày sinh" name="birthday" initialValue={user?.birthday ? dayjs(user.birthday) : null}>
              <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
            </Form.Item>

          </Form>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <Descriptions bordered layout="vertical" size="small" column={1}>
              <Descriptions.Item label={<><MailOutlined /> Email</>}>
                {user?.email || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                {user?.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label={<><ManOutlined /> Giới tính</>}>
                {user?.gender || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Ngày sinh</>}>
                {user?.birthday ? (typeof user.birthday === 'string' ? new Date(user.birthday).toLocaleDateString() : new Date(user.birthday).toLocaleDateString()) : 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            {handleInput ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '4px' }} onClick={handleUpdateUser}>
                  Lưu
                </Button>
                <Button type="default" htmlType="submit" style={{ width: '100%', borderRadius: '4px' }} onClick={() => setHandleInput(false)}>
                  Hủy
                </Button>
              </div>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  block
                  onClick={() => setHandleInput(true)}
                  style={{ borderRadius: '4px' }}
                >
                  Chỉnh sửa thông tin
                </Button>
              </>
            )}
          </Col>
          <Col span={12}>
            {handleInput ? (
              <></>
            ) : (

              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                block
                onClick={() => {
                  message.success('Đăng xuất thành công!');
                  logout();
                }}
              >
                Đăng xuất
              </Button>
            )}
          </Col>
        </Row>
      </Card>
      <UpdateAvatarModel openUpdateAvatar={openUpdateAvatar} setOpenUpdateAvatar={setOpenUpdateAvatar}/>
    </Modal>
  );
};

export default UserModal;