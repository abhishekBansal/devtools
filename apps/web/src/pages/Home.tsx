import React, { useState, useMemo } from 'react';
import { Typography, Row, Col, Space, Divider } from 'antd';
import { Helmet } from 'react-helmet-async';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { RecentlyUsed } from '../components/RecentlyUsed';
import { tools, categories, searchTools, getToolsByCategory } from '../data/tools';
import '../utils/testRecentTools'; // Import test utilities

const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }
    return searchTools(searchQuery);
  }, [searchQuery]);

  const toolsByCategory = useMemo(() => {
    if (searchQuery.trim()) {
      return null; // Don't show categories when searching
    }
    
    return categories.map(category => ({
      category,
      tools: getToolsByCategory(category),
    })).filter(group => group.tools.length > 0);
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>DevTools - Developer Utilities Platform</title>
        <meta 
          name="description" 
          content="Free online developer tools including Base64 encoder/decoder, JSON validator, hex converter, timestamp converter, and UUID generator." 
        />
        <meta 
          name="keywords" 
          content="devtools, developer tools, base64, json validator, hex converter, timestamp, uuid generator, online tools" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Title level={1}>🔧 Developer Tools</Title>
          <Paragraph style={{ fontSize: '18px', marginBottom: '32px' }}>
            Essential utilities for developers. Fast, secure, and completely free.
          </Paragraph>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools (try 'base64', 'json', 'timestamp'...)"
          />
        </div>

        {/* Search Results or Categories */}
        {searchQuery.trim() ? (
          <div>
            <Title level={3}>
              Search Results ({filteredTools.length})
            </Title>
            <Row gutter={[24, 24]}>
              {filteredTools.map(tool => (
                <Col xs={24} sm={12} lg={8} xl={6} key={tool.slug}>
                  <ToolCard tool={tool} />
                </Col>
              ))}
            </Row>
            {filteredTools.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Paragraph>No tools found matching "{searchQuery}"</Paragraph>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recently Used Tools */}
            <RecentlyUsed />
          
            {toolsByCategory?.map(({ category, tools }) => (
              <div key={category}>
                <Title level={3}>{category}</Title>
                <Row gutter={[24, 24]}>
                  {tools.map(tool => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={tool.slug}>
                      <ToolCard tool={tool} />
                    </Col>
                  ))}
                </Row>
                <Divider />
              </div>
            ))}
          </>
        )}
      </Space>
    </>
  );
};
