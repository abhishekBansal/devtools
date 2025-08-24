import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, message, Row, Col } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { generateUuidV4, isValidUuid, generateMultipleUuids } from '@devtools/core';
import { ToolPageWrapper } from '../../components/ToolPageWrapper';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

export const UuidPage: React.FC = () => {
  const [singleUuid, setSingleUuid] = useState('');
  const [multipleCount, setMultipleCount] = useState('5');
  const [multipleUuids, setMultipleUuids] = useState<string[]>([]);
  const [validationInput, setValidationInput] = useState('');
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  const generateSingle = () => {
    const uuid = generateUuidV4();
    setSingleUuid(uuid);
  };

  const generateMultiple = () => {
    try {
      const count = parseInt(multipleCount, 10);
      if (isNaN(count) || count < 1 || count > 100) {
        message.error('Count must be between 1 and 100');
        return;
      }
      const uuids = generateMultipleUuids(count);
      setMultipleUuids(uuids);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      message.error(errorMessage);
    }
  };

  const validateUuid = () => {
    if (!validationInput.trim()) {
      setValidationResult(null);
      return;
    }
    
    const isValid = isValidUuid(validationInput.trim());
    setValidationResult(isValid);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const copyAllUuids = async () => {
    if (multipleUuids.length === 0) return;
    
    try {
      await navigator.clipboard.writeText(multipleUuids.join('\n'));
      message.success(`Copied all ${multipleUuids.length} UUIDs to clipboard!`);
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  // Auto-validate on input change
  React.useEffect(() => {
    const timer = setTimeout(validateUuid, 300);
    return () => clearTimeout(timer);
  }, [validationInput]);

  // Generate initial UUID
  React.useEffect(() => {
    generateSingle();
  }, []);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>UUID Generator - DevTools</title>
        <meta 
          name="description" 
          content="Free online UUID v4 generator. Generate single or multiple UUIDs and validate UUID format." 
        />
        <meta 
          name="keywords" 
          content="uuid, guid, generator, uuid v4, unique identifier, uuid validator, online tool" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>UUID Generator</Title>
          <Paragraph>
            Generate UUID v4 (universally unique identifiers) for your applications. 
            Also validate existing UUIDs for proper format.
          </Paragraph>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="Generate Single UUID" size="small">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Input
                  value={singleUuid}
                  readOnly
                  style={{ fontFamily: 'monospace' }}
                  addonAfter={
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(singleUuid)}
                      >
                        Copy
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={generateSingle}
                      >
                        New
                      </Button>
                    </Space>
                  }
                />
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="UUID Validator" size="small">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Input
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  placeholder="Enter UUID to validate..."
                  style={{ fontFamily: 'monospace' }}
                />
                
                {validationResult !== null && (
                  <Text 
                    type={validationResult ? 'success' : 'danger'}
                    style={{ fontWeight: 'bold' }}
                  >
                    {validationResult ? '✓ Valid UUID' : '✗ Invalid UUID format'}
                  </Text>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title="Generate Multiple UUIDs">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space>
              <Text>Count:</Text>
              <Input
                value={multipleCount}
                onChange={(e) => setMultipleCount(e.target.value)}
                style={{ width: 100 }}
                placeholder="5"
              />
              <Button type="primary" onClick={generateMultiple}>
                Generate
              </Button>
              {multipleUuids.length > 0 && (
                <Button 
                  icon={<CopyOutlined />}
                  onClick={copyAllUuids}
                >
                  Copy All
                </Button>
              )}
            </Space>

            {multipleUuids.length > 0 && (
              <TextArea
                value={multipleUuids.join('\n')}
                readOnly
                rows={Math.min(multipleUuids.length, 10)}
                style={{ 
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5'
                }}
              />
            )}
          </Space>
        </Card>

        <Card title="About UUIDs" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              UUID (Universally Unique Identifier) is a 128-bit identifier used to uniquely 
              identify information in computer systems.
            </Paragraph>
            <ul>
              <li>UUID v4 uses random or pseudo-random numbers</li>
              <li>Extremely low probability of duplicate values</li>
              <li>Format: 8-4-4-4-12 hexadecimal digits (36 characters total)</li>
              <li>Commonly used in databases, APIs, and distributed systems</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </ToolPageWrapper>
  );
};
