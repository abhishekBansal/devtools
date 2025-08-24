import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <AntFooter style={{ 
      textAlign: 'center', 
      padding: '24px 50px',
      background: isDark ? '#001529' : '#f5f5f5',
      borderTop: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
      marginTop: 'auto'
    }}>
      <Space direction="vertical" size="small">
        <Space split="|" size="large">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="https://github.com/abhishekBansal/devtools" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </Space>
        <Text type="secondary">
          DevTools Platform © 2025. Built with React, TypeScript, and Ant Design.
        </Text>
      </Space>
    </AntFooter>
  );
};
