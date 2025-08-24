import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { ToolDef } from '../data/tools';

const { Title, Paragraph } = Typography;

interface ToolCardProps {
  tool: ToolDef;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link 
      to={`/tools/${tool.slug}`} 
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <Card
        hoverable
        style={{ 
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Card.Meta
          title={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Title level={4} style={{ margin: 0, color: 'inherit' }}>
                {tool.title}
              </Title>
              <Tag color="blue">{tool.category}</Tag>
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Paragraph style={{ margin: 0, color: 'inherit' }} ellipsis={{ rows: 2 }}>
                {tool.description}
              </Paragraph>
              <Space size={[0, 8]} wrap>
                {tool.keywords.slice(0, 3).map(keyword => (
                  <Tag key={keyword}>
                    {keyword}
                  </Tag>
                ))}
              </Space>
            </Space>
          }
        />
      </Card>
    </Link>
  );
};
