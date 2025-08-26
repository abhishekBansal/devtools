import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Input } from 'antd';
import {
  CodeOutlined,
  FileTextOutlined,
  NumberOutlined,
  FieldTimeOutlined,
  KeyOutlined,
  CalendarOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  BgColorsOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';
import { tools } from '../data/tools';

const { SubMenu } = Menu;

const toolIcons: { [key: string]: React.ReactNode } = {
  base64: <CodeOutlined />,
  json: <FileTextOutlined />,
  hex: <NumberOutlined />,
  timestamp: <FieldTimeOutlined />,
  uuid: <KeyOutlined />,
  cron: <CalendarOutlined />,
  'string-analyzer': <FontSizeOutlined />,
  'string-case-converter': <FontColorsOutlined />,
  'xml-formatter': <FileTextOutlined />,
  'color-converter': <BgColorsOutlined />,
};

const SideNav: React.FC = () => {
  const { getRecentToolsWithDetails } = useRecentlyUsed();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const recentToolsWithDetails = getRecentToolsWithDetails(tools);

  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedKey = location.pathname.split('/').pop() || '';
  return (
    <div>
      <div style={{ padding: '16px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search tools"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ borderRight: 0 }}
        defaultOpenKeys={['recent', 'all']}
      >
        {recentToolsWithDetails.length > 0 && (
          <SubMenu key="recent" title="Recently Used">
            {recentToolsWithDetails.map((tool) => (
              <Menu.Item key={tool.slug} icon={toolIcons[tool.slug]}>
                <Link to={`/tools/${tool.slug}`}>{tool.title}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        )}
        <SubMenu key="all" title="All Tools">
          {filteredTools.map((tool) => (
            <Menu.Item key={tool.slug} icon={toolIcons[tool.slug]}>
              <Link to={`/tools/${tool.slug}`}>{tool.title}</Link>
            </Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </div>
  );
};

export default SideNav;
