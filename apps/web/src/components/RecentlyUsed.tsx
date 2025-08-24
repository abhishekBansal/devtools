import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';
import { tools } from '../data/tools';
import { ToolCard } from './ToolCard';

const { Title } = Typography;

interface RecentlyUsedProps {
  showTitle?: boolean;
  maxItems?: number;
}

export const RecentlyUsed: React.FC<RecentlyUsedProps> = ({
  showTitle = true,
  maxItems = 4,
}) => {
  const { getRecentToolsWithDetails, clearRecentTools, hasRecentTools } = useRecentlyUsed();
  
  const recentToolsWithDetails = getRecentToolsWithDetails(tools).slice(0, maxItems);

  const formatLastUsed = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!hasRecentTools) {
    return null;
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {showTitle && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>
            <Space>
              <ClockCircleOutlined />
              Recently Used
            </Space>
          </Title>
          <Button
            size="small"
            type="text"
            icon={<DeleteOutlined />}
            onClick={clearRecentTools}
            title="Clear all"
          >
            Clear
          </Button>
        </div>
      )}
      <Row gutter={[16, 16]}>
        {recentToolsWithDetails.map((tool) => (
          <Col
            key={tool.slug}
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <ToolCard
              tool={tool}
              visitCount={tool.visitCount}
              lastUsed={formatLastUsed(tool.lastUsed)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
