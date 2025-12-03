import React from 'react';
import type { ReactNode } from 'react';
import { Layout } from 'antd';
import { useResponsive } from '../hooks/useResponsive';

const { Content } = Layout;

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={`mobile-layout ${className}`}>
      <Content className="mobile-content">
        {children}
      </Content>
    </div>
  );
};

export default MobileLayout; 