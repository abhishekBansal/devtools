import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { ToolDef } from '../data/tools';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ToolCardProps {
  tool: ToolDef;
  visitCount?: number;
  lastUsed?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, visitCount, lastUsed }) => {
  const showUsage = visitCount !== undefined && lastUsed !== undefined;

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
          display: 'flex',
          flexDirection: 'column'
        }}
        bodyStyle={{ padding: '16px', flexGrow: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <Title level={4} style={{ margin: 0, color: 'inherit', fontSize: '16px' }}>
              {tool.title}
            </Title>
            <Tag color="blue" style={{ marginTop: '8px' }}>{tool.category}</Tag>
            <Paragraph style={{ marginTop: '12px', color: 'inherit' }} ellipsis={{ rows: 2 }}>
              {tool.description}
            </Paragraph>
          </div>
          
          {showUsage && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <Space size="small">
                <EyeOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {visitCount} use{visitCount! > 1 ? 's' : ''}
                </Text>
              </Space>
              <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {lastUsed}
              </Text>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
