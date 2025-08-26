import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import {
  GithubOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onMenuClick: () => void;
  isToolPage: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onThemeToggle,
  onMenuClick,
  isToolPage,
}) => {
  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: isDark ? '#001529' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
      }}
    >
      <Space align="center">
        {isToolPage && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            style={{ color: isDark ? '#ffffff' : '#000000' }}
          />
        )}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Title
            level={3}
            style={{
              margin: 0,
              color: isDark ? '#ffffff' : '#000000',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
          >
            🔧 DevTools
          </Title>
        </Link>
      </Space>

      <Space>
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={onThemeToggle}
          style={{ color: isDark ? '#ffffff' : '#000000' }}
        />
        <Button
          type="text"
          icon={<GithubOutlined />}
          href="https://github.com/abhishekBansal/devtools"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: isDark ? '#ffffff' : '#000000' }}
        />
      </Space>
    </AntHeader>
  );
};
