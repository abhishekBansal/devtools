import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Empty, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';
import { tools } from '../data/tools';

const { Title, Text } = Typography;

interface RecentlyUsedProps {
  showTitle?: boolean;
  maxItems?: number;
  layout?: 'horizontal' | 'vertical';
}

export const RecentlyUsed: React.FC<RecentlyUsedProps> = ({
  showTitle = true,
  maxItems = 6,
  layout = 'horizontal'
}) => {
  const { getRecentToolsWithDetails, removeRecentTool, clearRecentTools, hasRecentTools } = useRecentlyUsed();
  
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
    return (
      <Card 
        title={showTitle ? (
          <Space>
            <ClockCircleOutlined />
            Recently Used
          </Space>
        ) : null}
        size="small"
      >
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No recently used tools"
          style={{ padding: '20px 0' }}
        />
      </Card>
    );
  }

  return (
    <Card
      title={showTitle ? (
        <Space>
          <ClockCircleOutlined />
          Recently Used
        </Space>
      ) : null}
      size="small"
      extra={
        hasRecentTools && (
          <Button 
            size="small" 
            type="text" 
            icon={<DeleteOutlined />}
            onClick={clearRecentTools}
            title="Clear all"
          >
            Clear
          </Button>
        )
      }
    >
      <Row gutter={[16, 16]}>
        {recentToolsWithDetails.map((tool) => (
          <Col 
            key={tool.slug} 
            xs={24} 
            sm={layout === 'horizontal' ? 12 : 24} 
            md={layout === 'horizontal' ? 8 : 24}
            lg={layout === 'horizontal' ? 6 : 24}
          >
            <Card
              size="small"
              hoverable
              style={{ 
                height: '100%',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '12px' }}
              actions={[
                <Tooltip title="Remove from recent" key="remove">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRecentTool(tool.slug);
                    }}
                  />
                </Tooltip>
              ]}
            >
              <Link to={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Title level={5} style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                      {tool.title}
                    </Title>
                    <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px', lineHeight: '16px' }}>
                      {tool.category}
                    </Tag>
                  </div>
                  
                  <Text 
                    type="secondary" 
                    style={{ 
                      fontSize: '12px', 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.3'
                    }}
                  >
                    {tool.description}
                  </Text>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <Space size="small">
                      <EyeOutlined style={{ fontSize: '10px', color: '#8c8c8c' }} />
                      <Text style={{ fontSize: '10px', color: '#8c8c8c' }}>
                        {tool.visitCount} use{tool.visitCount > 1 ? 's' : ''}
                      </Text>
                    </Space>
                    <Text style={{ fontSize: '10px', color: '#8c8c8c' }}>
                      {formatLastUsed(tool.lastUsed)}
                    </Text>
                  </div>
                </Space>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
