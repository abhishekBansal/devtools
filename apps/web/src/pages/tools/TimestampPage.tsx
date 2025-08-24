import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, message, Row, Col } from 'antd';
import { CopyOutlined, ClearOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { ToolPageWrapper } from '../../components/ToolPageWrapper';
import {
  unixToIso,
  isoToUnix,
  getCurrentUnixTimestamp,
  getCurrentIsoTimestamp,
  formatTimestamp,
} from '@devtools/core';

const { Title, Paragraph, Text } = Typography;

export const TimestampPage: React.FC = () => {
  const [unixInput, setUnixInput] = useState('');
  const [isoInput, setIsoInput] = useState('');
  const [unixOutput, setUnixOutput] = useState('');
  const [isoOutput, setIsoOutput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [currentTime, setCurrentTime] = useState({
    unix: getCurrentUnixTimestamp(),
    iso: getCurrentIsoTimestamp(),
  });

  const handleUnixToIso = () => {
    if (!unixInput.trim()) {
      setIsoOutput('');
      setFormattedOutput('');
      return;
    }

    try {
      const timestamp = parseInt(unixInput.trim(), 10);
      if (isNaN(timestamp)) {
        throw new Error('Invalid Unix timestamp');
      }
      
      const iso = unixToIso(timestamp);
      const formatted = formatTimestamp(timestamp);
      
      setIsoOutput(iso);
      setFormattedOutput(formatted);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      message.error(errorMessage);
      setIsoOutput('');
      setFormattedOutput('');
    }
  };

  const handleIsoToUnix = () => {
    if (!isoInput.trim()) {
      setUnixOutput('');
      setFormattedOutput('');
      return;
    }

    try {
      const unix = isoToUnix(isoInput.trim());
      const formatted = formatTimestamp(isoInput.trim());
      
      setUnixOutput(unix.toString());
      setFormattedOutput(formatted);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      message.error(errorMessage);
      setUnixOutput('');
      setFormattedOutput('');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setUnixInput('');
    setIsoInput('');
    setUnixOutput('');
    setIsoOutput('');
    setFormattedOutput('');
  };

  const updateCurrentTime = () => {
    setCurrentTime({
      unix: getCurrentUnixTimestamp(),
      iso: getCurrentIsoTimestamp(),
    });
  };

  const useCurrentTime = (type: 'unix' | 'iso') => {
    updateCurrentTime();
    if (type === 'unix') {
      setUnixInput(currentTime.unix.toString());
    } else {
      setIsoInput(currentTime.iso);
    }
  };

  // Auto-convert on input change
  React.useEffect(() => {
    const timer = setTimeout(handleUnixToIso, 300);
    return () => clearTimeout(timer);
  }, [unixInput]);

  React.useEffect(() => {
    const timer = setTimeout(handleIsoToUnix, 300);
    return () => clearTimeout(timer);
  }, [isoInput]);

  // Update current time every second
  React.useEffect(() => {
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Timestamp Converter - DevTools</title>
        <meta 
          name="description" 
          content="Free online timestamp converter. Convert between Unix timestamps and ISO date strings with human-readable formatting." 
        />
        <meta 
          name="keywords" 
          content="timestamp, unix, iso, date, time, converter, epoch, online tool" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Timestamp Converter</Title>
          <Paragraph>
            Convert between Unix timestamps and ISO date strings. 
            Also shows human-readable formatted dates.
          </Paragraph>
        </div>

        {/* Current Time Display */}
        <Card 
          title={
            <Space>
              <ClockCircleOutlined />
              Current Time
            </Space>
          }
          extra={
            <Button size="small" onClick={updateCurrentTime}>
              Refresh
            </Button>
          }
        >
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small">
                <Text strong>Unix Timestamp</Text>
                <Input
                  value={currentTime.unix}
                  readOnly
                  style={{ fontFamily: 'monospace' }}
                  addonAfter={
                    <Button
                      type="link"
                      size="small"
                      onClick={() => useCurrentTime('unix')}
                    >
                      Use
                    </Button>
                  }
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small">
                <Text strong>ISO String</Text>
                <Input
                  value={currentTime.iso}
                  readOnly
                  style={{ fontFamily: 'monospace' }}
                  addonAfter={
                    <Button
                      type="link"
                      size="small"
                      onClick={() => useCurrentTime('iso')}
                    >
                      Use
                    </Button>
                  }
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small">
                <Text strong>Formatted</Text>
                <Input
                  value={formatTimestamp(currentTime.unix)}
                  readOnly
                  style={{ fontSize: '12px' }}
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Conversion Tools */}
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="Unix to ISO" size="small">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>Unix Timestamp</Text>
                  <Input
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="Enter Unix timestamp (e.g., 1692272347)"
                    style={{ fontFamily: 'monospace' }}
                  />
                </Space>

                {isoOutput && (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>ISO String</Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(isoOutput)}
                      >
                        Copy
                      </Button>
                    </Space>
                    <Input
                      value={isoOutput}
                      readOnly
                      style={{ 
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5'
                      }}
                    />
                  </Space>
                )}

                {formattedOutput && (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>Formatted</Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(formattedOutput)}
                      >
                        Copy
                      </Button>
                    </Space>
                    <Input
                      value={formattedOutput}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Space>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="ISO to Unix" size="small">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>ISO String</Text>
                  <Input
                    value={isoInput}
                    onChange={(e) => setIsoInput(e.target.value)}
                    placeholder="Enter ISO string (e.g., 2023-08-17T18:39:07.000Z)"
                    style={{ fontFamily: 'monospace' }}
                  />
                </Space>

                {unixOutput && (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>Unix Timestamp</Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(unixOutput)}
                      >
                        Copy
                      </Button>
                    </Space>
                    <Input
                      value={unixOutput}
                      readOnly
                      style={{ 
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5'
                      }}
                    />
                  </Space>
                )}

                {formattedOutput && (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>Formatted</Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(formattedOutput)}
                      >
                        Copy
                      </Button>
                    </Space>
                    <Input
                      value={formattedOutput}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Space>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Space>
          <Button 
            type="primary" 
            onClick={() => {
              handleUnixToIso();
              handleIsoToUnix();
            }}
            disabled={!unixInput.trim() && !isoInput.trim()}
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

        <Card title="About Timestamps" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              Unix timestamp represents the number of seconds since January 1, 1970 UTC (Unix epoch). 
              ISO 8601 is an international standard for date and time representation.
            </Paragraph>
            <ul>
              <li>Unix timestamp: seconds since epoch (1970-01-01 00:00:00 UTC)</li>
              <li>ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ</li>
              <li>Millisecond timestamps are also supported (13-digit numbers)</li>
              <li>ISO strings can include timezone information</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </ToolPageWrapper>
  );
};
