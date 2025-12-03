import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large';
  type?: 'text' | 'link' | 'default' | 'primary' | 'dashed';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'middle', 
  type = 'text',
  className = ''
}) => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={themeMode === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}>
      <Button
        type={type}
        size={size}
        icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        className={`theme-toggle ${className}`}
        style={{
          color: themeMode === 'light' ? 'var(--yahoo-text)' : 'var(--yahoo-text)',
          transition: 'var(--theme-transition)',
          borderRadius: '50%',
          width: size === 'small' ? '32px' : size === 'middle' ? '40px' : '48px',
          height: size === 'small' ? '32px' : size === 'middle' ? '40px' : '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid var(--yahoo-border)`,
          backgroundColor: 'var(--yahoo-card-bg)',
          boxShadow: 'var(--yahoo-shadow-light)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = 'var(--yahoo-shadow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--yahoo-shadow-light)';
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle; 