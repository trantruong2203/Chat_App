import { Button, Form, Input, Card, Typography } from 'antd';
import { WechatOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePasswordThunk } from '../../features/users/userThunks';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../stores/store';

const { Title, Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC<{email: string}> = ({email}) => {
    const [form] = Form.useForm<ResetPasswordForm>();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    const validation = async () => {
      try {
        const values = await form.validateFields();
        if (values.password !== values.confirmPassword) {
            toast.error("Mật khẩu không khớp");
            return false;
        }
        if (values.password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
          return false;
        }
        return true;
      } catch {
        return false;
      }
    };

    const handleSubmit = async () => {
        if (!(await validation())) return;
        
        try {
            const values = await form.validateFields();
            await dispatch(updatePasswordThunk({ email: email, password: values.password })).unwrap();
            toast.success('Mật khẩu đã được cập nhật thành công');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Mật khẩu đã được cập nhật thất bại');
            }
        }
    }
    return (
        <div>
            <div className="auth-background" style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                <div className="glass-effect" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 0
                }}></div>

                <Card
                    className="glass-effect fade-in"
                    style={{
                        width: '400px',
                        padding: '20px',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        zIndex: 1,
                        display: isModalVisible ? 'none' : 'block'

                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                        <div className="gradient-bg" style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 16px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <WechatOutlined style={{ fontSize: 36, color: 'white' }} />
                        </div>
                        <Title level={2} style={{ marginTop: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Đặt lại mật khẩu</Title>
                    </div>

                    <Form<ResetPasswordForm>
                        form={form}
                        name="login"
                        initialValues={{ email: email }}
                        onFinish={handleSubmit}
                        size="large"
                        layout="vertical"

                    >
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                className="message-input"
                                prefix={<UserOutlined style={{ color: 'var(--primary-color)', opacity: 0.7 }} />}
                                placeholder="Mật khẩu"
                                style={{ height: '46px' }}
                                type="password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                className="message-input"
                                prefix={<UserOutlined style={{ color: 'var(--primary-color)', opacity: 0.7 }} />}
                                placeholder="Nhập lại mật khẩu"
                                style={{ height: '46px' }}
                                type="password"
                            />
                        </Form.Item>

                            <Button
                                block
                                type="primary"
                                htmlType="submit"
                                style={{
                                    height: '46px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    boxShadow: 'var(--shadow-md)',
                                }}
                            >
                                Đặt lại mật khẩu
                            </Button>

                        <div style={{ textAlign: 'center' }}>
                            <Text style={{ marginRight: 8, color: 'var(--text-secondary)' }}>Quay lại trang đăng nhập?</Text>
                            <Link to="/" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Đăng nhập ngay!</Link>
                            </div>
                    </Form>
                </Card>

            </div>
        </div>

    );
}

export default ResetPassword;