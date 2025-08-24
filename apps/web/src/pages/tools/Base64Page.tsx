import React, { useState } from 'react';
import { Card, Input, Radio, Button, Space, Typography, message, Row, Col } from 'antd';
import { CopyOutlined, ClearOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { encodeBase64, decodeBase64 } from '@devtools/core';
import { ToolPageWrapper } from '../../components/ToolPageWrapper';
import { DebugPanel } from '../../components/DebugPanel';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

type Mode = 'encode' | 'decode';

export const Base64Page: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = mode === 'encode' 
        ? encodeBase64(input) 
        : decodeBase64(input);
      setOutput(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      message.error(errorMessage);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      message.success('Copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  // Auto-convert on input change
  React.useEffect(() => {
    const timer = setTimeout(handleConvert, 300);
    return () => clearTimeout(timer);
  }, [input, mode]);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Base64 Encoder/Decoder - DevTools</title>
        <meta 
          name="description" 
          content="Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 strings with UTF-8 support." 
        />
        <meta 
          name="keywords" 
          content="base64, encode, decode, base64 encoder, base64 decoder, utf8, online tool" 
        />
      </Helmet>

      {/* Debug Panel - temporary */}
      <DebugPanel />

      <div>
        <Title level={2}>Base64 Encoder/Decoder</Title>
        <Paragraph>
          Encode text to Base64 or decode Base64 strings back to text. 
          Supports UTF-8 encoding for international characters.
        </Paragraph>
      </div>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Radio.Group 
                value={mode} 
                onChange={(e) => setMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="encode">Encode</Radio.Button>
                <Radio.Button value="decode">Decode</Radio.Button>
              </Radio.Group>
            </div>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Typography.Text strong>
                    {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                  </Typography.Text>
                  <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode' 
                      ? 'Enter text to encode...' 
                      : 'Enter Base64 string to decode...'
                    }
                    rows={8}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Space>
              </Col>

              <Col xs={24} lg={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <Typography.Text strong>
                      {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                    </Typography.Text>
                    <Button
                      type="link"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={handleCopy}
                      disabled={!output}
                    >
                      Copy
                    </Button>
                  </Space>
                  <TextArea
                    value={output}
                    readOnly
                    rows={8}
                    style={{ 
                      fontFamily: 'monospace',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </Space>
              </Col>
            </Row>

            <Space>
              <Button 
                type="primary" 
                onClick={handleConvert}
                disabled={!input.trim()}
              >
                Convert
              </Button>
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClear}
              >
                Clear
              </Button>
            </Space>
          </Space>
        </Card>

        <Card title="About Base64 Encoding" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              Base64 is a binary-to-text encoding scheme that represents binary data in ASCII format. 
              It's commonly used in web development, email encoding, and data transmission.
            </Paragraph>
            <ul>
              <li>Safe for URLs and file names</li>
              <li>Can encode any binary data including text, images, and files</li>
              <li>Increases data size by approximately 33%</li>
              <li>Uses characters A-Z, a-z, 0-9, +, /, and = for padding</li>
            </ul>
          </Space>
        </Card>
    </ToolPageWrapper>
  );
};
