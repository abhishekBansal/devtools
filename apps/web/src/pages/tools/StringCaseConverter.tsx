import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Space, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { getAllCaseConversions } from '@devtools/core';

const { Title } = Typography;
const { TextArea } = Input;

const StringCaseConverterTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [conversions, setConversions] = useState<Record<string, string>>({});


  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value) {
      try {
        const results = getAllCaseConversions(value);
        setConversions(results);
      } catch (error) {
        setConversions({});
      }
    } else {
      setConversions({});
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const caseDefinitions = [
    { key: 'camelCase', name: 'camelCase', description: 'First word lowercase, subsequent words capitalized' },
    { key: 'PascalCase', name: 'PascalCase', description: 'All words capitalized, no spaces' },
    { key: 'snake_case', name: 'snake_case', description: 'All lowercase with underscores' },
    { key: 'kebab-case', name: 'kebab-case', description: 'All lowercase with hyphens' },
    { key: 'CONSTANT_CASE', name: 'CONSTANT_CASE', description: 'All uppercase with underscores' },
    { key: 'Title Case', name: 'Title Case', description: 'First letter of each word capitalized' },
    { key: 'sentence case', name: 'sentence case', description: 'Only first letter capitalized' },
    { key: 'UPPERCASE', name: 'UPPERCASE', description: 'All letters uppercase' },
    { key: 'lowercase', name: 'lowercase', description: 'All letters lowercase' }
  ];

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>String Case Converter - Devtools</title>
        <meta 
          name="description" 
          content="Convert text between different case formats including camelCase, PascalCase, snake_case, kebab-case, and more." 
        />
      </Helmet>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>String Case Converter</Title>
        <p>Convert text between different case formats for programming and documentation.</p>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="Input Text" size="small">
              <TextArea
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter text to convert (e.g., 'hello world', 'Hello World', 'hello-world')"
                rows={4}
                style={{ fontFamily: 'monospace' }}
              />
            </Card>

            <Card title="About Case Formats" size="small" style={{ marginTop: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {caseDefinitions.map((caseType) => (
                  <div key={caseType.key}>
                    <strong>{caseType.name}:</strong> {caseType.description}
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Conversion Results" size="small">
              {Object.keys(conversions).length > 0 ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {caseDefinitions.map((caseType) => {
                    const result = conversions[caseType.key];
                    return result ? (
                      <div key={caseType.key} style={{ marginBottom: '12px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>{caseType.name}:</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Input
                            value={result}
                            readOnly
                            style={{ 
                              fontFamily: 'monospace',
                              backgroundColor: '#f5f5f5',
                              flex: 1
                            }}
                          />
                          <Button
                            icon={<CopyOutlined />}
                            size="small"
                            onClick={() => copyToClipboard(result)}
                          />
                        </div>
                      </div>
                    ) : null;
                  })}
                </Space>
              ) : (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                  Enter text to see conversion results
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Card title="Usage Examples" size="small" style={{ marginTop: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>Common use cases:</strong>
              <ul>
                <li><strong>Programming:</strong> Convert variable names between naming conventions</li>
                <li><strong>API Development:</strong> Transform property names for different systems</li>
                <li><strong>Database Design:</strong> Convert column names between formats</li>
                <li><strong>Documentation:</strong> Format headings and titles consistently</li>
                <li><strong>File Naming:</strong> Convert file names to appropriate formats</li>
              </ul>
            </div>
            <div>
              <strong>Examples:</strong>
              <ul>
                <li>"hello world" → camelCase: "helloWorld"</li>
                <li>"user name" → snake_case: "user_name"</li>
                <li>"api endpoint" → kebab-case: "api-endpoint"</li>
                <li>"max retry count" → CONSTANT_CASE: "MAX_RETRY_COUNT"</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </ToolPageWrapper>
  );
};

export default StringCaseConverterTool;
