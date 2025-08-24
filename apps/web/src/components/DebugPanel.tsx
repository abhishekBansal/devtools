import React from 'react';
import { Card, Typography, Space } from 'antd';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';
import { useLocation } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export const DebugPanel: React.FC = () => {
  const location = useLocation();
  const { recentTools, hasRecentTools, getRecentToolsSlugs } = useRecentlyUsed();
  
  return (
    <Card title="Debug Info" size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Current Path: </Text>
          <Text code>{location.pathname}</Text>
        </div>
        
        <div>
          <Text strong>Has Recent Tools: </Text>
          <Text>{hasRecentTools ? 'Yes' : 'No'}</Text>
        </div>
        
        <div>
          <Text strong>Recent Tools Count: </Text>
          <Text>{recentTools.length}</Text>
        </div>
        
        <div>
          <Text strong>Recent Tools Slugs: </Text>
          <Text code>{JSON.stringify(getRecentToolsSlugs())}</Text>
        </div>
        
        <div>
          <Text strong>Raw Recent Tools: </Text>
          <Paragraph>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
              {JSON.stringify(recentTools, null, 2)}
            </pre>
          </Paragraph>
        </div>
        
        <div>
          <Text strong>localStorage Value: </Text>
          <Paragraph>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
              {typeof window !== 'undefined' 
                ? localStorage.getItem('devtools_recently_used') || 'null'
                : 'N/A (server-side)'
              }
            </pre>
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default DebugPanel;
