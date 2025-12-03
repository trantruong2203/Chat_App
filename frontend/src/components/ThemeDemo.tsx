import React from 'react';
import { Card, Button, Input, Space, Divider, Typography } from 'antd';
import { useTheme } from '../hooks/useTheme';

const { Title, Text } = Typography;

const ThemeDemo: React.FC = () => {
  const { themeMode } = useTheme();

  return (
    <div style={{ padding: '20px', background: 'var(--yahoo-bg)', minHeight: '100vh' }}>
      <Title level={2} style={{ color: 'var(--yahoo-text)', textAlign: 'center', marginBottom: '30px' }}>
        Dark Mode Demo - {themeMode === 'dark' ? '🌙' : '☀️'}
      </Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        {/* Background Colors Demo */}
        <Card title="Background Colors" style={{ background: 'var(--yahoo-card-bg)', borderColor: 'var(--yahoo-border)' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-bg)', 
              border: '1px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)'
            }}>
              Primary Background (--yahoo-bg)
            </div>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-bg-secondary)', 
              border: '1px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)'
            }}>
              Secondary Background (--yahoo-bg-secondary)
            </div>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-bg-tertiary)', 
              border: '1px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)'
            }}>
              Tertiary Background (--yahoo-bg-tertiary)
            </div>
          </Space>
        </Card>

        {/* Text Colors Demo */}
        <Card title="Text Colors" style={{ background: 'var(--yahoo-card-bg)', borderColor: 'var(--yahoo-border)' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text style={{ color: 'var(--yahoo-text)', fontSize: '16px' }}>
              Primary Text (--yahoo-text)
            </Text>
            <Text style={{ color: 'var(--yahoo-text-secondary)', fontSize: '16px' }}>
              Secondary Text (--yahoo-text-secondary)
            </Text>
            <Text style={{ color: 'var(--yahoo-text-tertiary)', fontSize: '16px' }}>
              Tertiary Text (--yahoo-text-tertiary)
            </Text>
          </Space>
        </Card>

        {/* Border Colors Demo */}
        <Card title="Border Colors" style={{ background: 'var(--yahoo-card-bg)', borderColor: 'var(--yahoo-border)' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-card-bg)', 
              border: '3px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)'
            }}>
              Primary Border (--yahoo-border)
            </div>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-card-bg)', 
              border: '3px solid var(--yahoo-border-light)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)'
            }}>
              Light Border (--yahoo-border-light)
            </div>
          </Space>
        </Card>

        {/* Interactive Elements Demo */}
        <Card title="Interactive Elements" style={{ background: 'var(--yahoo-card-bg)', borderColor: 'var(--yahoo-border)' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Input 
              placeholder="Input field with theme colors"
              style={{ 
                background: 'var(--yahoo-input-bg)',
                borderColor: 'var(--yahoo-border)',
                color: 'var(--yahoo-text)'
              }}
            />
            <Button 
              type="primary" 
              style={{ 
                background: 'var(--yahoo-primary)',
                borderColor: 'var(--yahoo-primary)'
              }}
            >
              Primary Button
            </Button>
            <Button 
              style={{ 
                background: 'var(--yahoo-card-bg)',
                borderColor: 'var(--yahoo-border)',
                color: 'var(--yahoo-text)'
              }}
            >
              Secondary Button
            </Button>
          </Space>
        </Card>

        {/* Shadows Demo */}
        <Card title="Shadows" style={{ background: 'var(--yahoo-card-bg)', borderColor: 'var(--yahoo-border)' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-card-bg)', 
              border: '1px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)',
              boxShadow: 'var(--yahoo-shadow-light)'
            }}>
              Light Shadow (--yahoo-shadow-light)
            </div>
            <div style={{ 
              padding: '20px', 
              background: 'var(--yahoo-card-bg)', 
              border: '1px solid var(--yahoo-border)',
              borderRadius: '8px',
              color: 'var(--yahoo-text)',
              boxShadow: 'var(--yahoo-shadow)'
            }}>
              Regular Shadow (--yahoo-shadow)
            </div>
          </Space>
        </Card>

        <Divider style={{ borderColor: 'var(--yahoo-border)' }}>
          <Text style={{ color: 'var(--yahoo-text-secondary)' }}>
            Theme: {themeMode.toUpperCase()}
          </Text>
        </Divider>
      </Space>
    </div>
  );
};

export default ThemeDemo; 