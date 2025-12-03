import React, { useState } from 'react';
import { UserOutlined, WechatOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Typography, Modal } from 'antd';
import { Link } from 'react-router-dom';
import type { LoginRequest } from '../../interface/UserResponse';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import ResetPassword from './ResetPassword';

const { Title, Text } = Typography;

const ForgetPassword: React.FC = () => {
  const [form] = Form.useForm<LoginRequest>();
  const [confirmCode, setConfirmCode] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [userInputCode, setUserInputCode] = useState<string>("");
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  
  // Tạo mã xác nhận ngẫu nhiên gồm 4 chữ số
  const generateConfirmCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();  // Mã xác nhận 4 số
  };

  // Thực hiện gửi mã xác nhận qua email
  const handleSubmit = async () => {
    const email = form.getFieldValue('email');
    
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      const code = generateConfirmCode(); // Tạo mã xác nhận ngẫu nhiên
      setConfirmCode(code);

      const templateParams = {
        username: email,
        verification_code: code,  // Gửi mã xác nhận qua email
        to_email: email,  // Địa chỉ email nhận
      };

      await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      toast.success("Mã xác nhận đã được gửi đến email của bạn");
      // Hiển thị modal nhập mã xác nhận
      setIsModalVisible(true);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi mã xác nhận. Vui lòng thử lại sau.");
      console.error("Lỗi gửi email:", error);
    }
  };

  const handleVerifyCode = () => {
    if (userInputCode === confirmCode) {
      toast.success("Mã xác nhận chính xác");
      setIsModalVisible(false);
      // Chuyển hướng đến trang đặt lại mật khẩu với thông tin người dùng
      setResetPassword(true);
    } else {
      toast.error("Mã xác nhận không chính xác. Vui lòng kiểm tra lại.");
      setUserInputCode(""); // Xóa mã nhập vào nếu không chính xác
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setUserInputCode("");
  }

  return (
    <>
    {resetPassword ? (
      <ResetPassword email={form.getFieldValue('email')} />
    ) : (
      
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
          <Title level={2} style={{ marginTop: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Quên mật khẩu</Title>
        </div>

        <Form<LoginRequest>
          form={form}
          name="login"
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
          
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
          >
            <Input
              className="message-input"
              prefix={<UserOutlined style={{ color: 'var(--primary-color)', opacity: 0.7 }} />}
              placeholder="Email"
              style={{ height: '46px' }}
            />
          </Form.Item>

          <Form.Item>
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
              Gửi mã xác thực
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ marginRight: 8, color: 'var(--text-secondary)' }}>Quay lại trang đăng nhập?</Text>
            <Link to="/" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Đăng nhập ngay!</Link>
          </div>
        </Form>
        {/* Modal xác nhận mã */}
        <Modal
          title={<span style={{ color: '#faad14', fontWeight: 'bold' }}>Nhập mã xác nhận</span>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy bỏ
            </Button>,
            <Button key="submit" type="primary" style={{ backgroundColor: '#faad14' }} onClick={handleVerifyCode}>
              Xác nhận
            </Button>
          ]}
        >
          <p style={{ marginBottom: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>
            Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã xác nhận:
          </p>
          <Input
            placeholder="Nhập mã xác nhận 4 số"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            maxLength={4}
            style={{ marginBottom: '16px' }}
          />
        </Modal>
      </Card>
    </div>
    )}
    </>
  );
};

export default ForgetPassword;