import React from 'react';
import { Spin, Card } from 'antd';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Đang tải...',
  size = 'default',
  fullScreen = false
}) => {
  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size={size} />
          <div style={{ marginTop: 16, fontSize: 16 }}>{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '50px 20px',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Spin size={size} />
      <div style={{ marginTop: 16 }}>{message}</div>
    </div>
  );
};

// Skeleton loading for posts
export const PostSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ marginBottom: 20, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              marginRight: 12
            }} />
            <div>
              <div style={{
                width: 120,
                height: 16,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                marginBottom: 8
              }} />
              <div style={{
                width: 80,
                height: 12,
                backgroundColor: '#f0f0f0',
                borderRadius: 4
              }} />
            </div>
          </div>
          <div style={{
            width: '100%',
            height: 60,
            backgroundColor: '#f0f0f0',
            borderRadius: 4,
            marginBottom: 15
          }} />
          <div style={{
            width: '100%',
            height: 200,
            backgroundColor: '#f0f0f0',
            borderRadius: 8
          }} />
        </Card>
      ))}
    </>
  );
};

export default Loading;