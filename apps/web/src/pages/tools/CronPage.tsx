import React, { useState, useMemo } from 'react';
import { Card, Input, Button, Space, Typography, message, Row, Col, Select, Alert, Divider, Tag } from 'antd';
import { CopyOutlined, ClearOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import ToolPageWrapper from '../../components/ToolPageWrapper';

const { Title, Paragraph, Text } = Typography;

// Temporary implementations until core package is built
const TEMP_CRON_PRESETS = [
  { name: 'Every minute', expression: '* * * * *' },
  { name: 'Every 5 minutes', expression: '*/5 * * * *' },
  { name: 'Every 15 minutes', expression: '*/15 * * * *' },
  { name: 'Every 30 minutes', expression: '*/30 * * * *' },
  { name: 'Every hour', expression: '@hourly' },
  { name: 'Every day at midnight', expression: '@daily' },
  { name: 'Every day at 6 AM', expression: '0 6 * * *' },
  { name: 'Every day at 6 PM', expression: '0 18 * * *' },
  { name: 'Every weekday at 9 AM', expression: '0 9 * * 1-5' },
  { name: 'Every weekend at 10 AM', expression: '0 10 * * 6,0' },
  { name: 'Every week (Sunday midnight)', expression: '@weekly' },
  { name: 'Every month (1st at midnight)', expression: '@monthly' },
  { name: 'Every year (Jan 1st at midnight)', expression: '@yearly' }
];

const tempValidateCronExpression = (expression: string): { valid: boolean; error?: string } => {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: 'Cron expression is required' };
  }

  const trimmed = expression.trim();
  
  // Check for common expressions
  const commonExpressions = ['@yearly', '@annually', '@monthly', '@weekly', '@daily', '@midnight', '@hourly'];
  if (commonExpressions.includes(trimmed)) {
    return { valid: true };
  }

  const parts = trimmed.split(/\s+/);
  
  if (parts.length !== 5) {
    return { valid: false, error: 'Cron expression must have exactly 5 fields (minute hour day month day_of_week)' };
  }

  // Basic validation
  return { valid: true };
};

const tempExplainCronExpression = (expression: string): string => {
  const trimmed = expression.trim();
  
  const explanations: { [key: string]: string } = {
    '@yearly': 'Once a year at midnight on January 1st',
    '@annually': 'Once a year at midnight on January 1st',
    '@monthly': 'Once a month at midnight on the 1st day',
    '@weekly': 'Once a week at midnight on Sunday',
    '@daily': 'Once a day at midnight',
    '@midnight': 'Once a day at midnight',
    '@hourly': 'Once an hour at the beginning of the hour'
  };

  if (explanations[trimmed]) {
    return explanations[trimmed];
  }

  // Basic explanation for standard expressions
  if (trimmed === '* * * * *') return 'Every minute';
  if (trimmed === '0 * * * *') return 'Every hour';
  if (trimmed === '0 0 * * *') return 'Every day at midnight';
  if (trimmed === '0 9 * * 1-5') return 'Every weekday at 9:00 AM';
  
  return 'Cron expression (basic validation only)';
};

const tempExpandCronExpression = (expression: string): string => {
  const expansions: { [key: string]: string } = {
    '@yearly': '0 0 1 1 *',
    '@annually': '0 0 1 1 *',
    '@monthly': '0 0 1 * *',
    '@weekly': '0 0 * * 0',
    '@daily': '0 0 * * *',
    '@midnight': '0 0 * * *',
    '@hourly': '0 * * * *'
  };
  
  return expansions[expression.trim()] || expression;
};

export const CronPage: React.FC = () => {
  const [cronInput, setCronInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [explanation, setExplanation] = useState('');
  const [expandedExpression, setExpandedExpression] = useState('');


  // Validate and explain cron expression
  const processExpression = (expression: string) => {
    if (!expression.trim()) {
      setValidationResult(null);
      setExplanation('');
      setExpandedExpression('');
      return;
    }

    const validation = tempValidateCronExpression(expression);
    setValidationResult(validation);

    if (validation.valid) {
      const explain = tempExplainCronExpression(expression);
      setExplanation(explain);
      
      const expanded = tempExpandCronExpression(expression);
      setExpandedExpression(expanded !== expression ? expanded : '');
    } else {
      setExplanation('');
      setExpandedExpression('');
    }
  };

  // Auto-process on input change
  React.useEffect(() => {
    const timer = setTimeout(() => processExpression(cronInput), 300);
    return () => clearTimeout(timer);
  }, [cronInput]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setCronInput('');
    setValidationResult(null);
    setExplanation('');
    setExpandedExpression('');
  };

  const handlePresetSelect = (presetExpression: string) => {
    setCronInput(presetExpression);
  };

  const presetOptions = useMemo(() => {
    return TEMP_CRON_PRESETS.map((preset: { name: string; expression: string }) => ({
      label: `${preset.name} (${preset.expression})`,
      value: preset.expression,
    }));
  }, []);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Cron Expression Parser - DevTools</title>
        <meta 
          name="description" 
          content="Parse, validate, and explain cron expressions. Convert cron schedules to human-readable descriptions with examples." 
        />
        <meta 
          name="keywords" 
          content="cron, crontab, schedule, parser, validator, expression, time, online tool" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Cron Expression Parser</Title>
          <Paragraph>
            Parse and validate cron expressions. Get human-readable explanations of what your cron schedule does.
          </Paragraph>
        </div>

        {/* Cron Expression Input */}
        <Card title="Cron Expression" size="small">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Enter Cron Expression</Text>
              <Input
                value={cronInput}
                onChange={(e) => setCronInput(e.target.value)}
                placeholder="e.g., 0 9 * * 1-5 or @daily"
                style={{ fontFamily: 'monospace' }}
                size="large"
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Format: minute hour day month day_of_week (or use @hourly, @daily, @weekly, @monthly, @yearly)
              </Text>
            </Space>

            {/* Validation Result */}
            {validationResult && (
              <Alert
                type={validationResult.valid ? 'success' : 'error'}
                icon={validationResult.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                message={validationResult.valid ? 'Valid cron expression' : 'Invalid cron expression'}
                description={validationResult.error}
                showIcon
              />
            )}

            {/* Explanation */}
            {explanation && (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <Text strong>Explanation</Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(explanation)}
                  >
                    Copy
                  </Button>
                </Space>
                <Alert
                  type="info"
                  icon={<InfoCircleOutlined />}
                  message={explanation}
                  style={{ 
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                  }}
                />
              </Space>
            )}

            {/* Expanded Expression */}
            {expandedExpression && (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <Text strong>Expanded Expression</Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(expandedExpression)}
                  >
                    Copy
                  </Button>
                </Space>
                <Input
                  value={expandedExpression}
                  readOnly
                  style={{ 
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </Space>
            )}

            <Space>
              <Button 
                type="primary" 
                onClick={() => processExpression(cronInput)}
                disabled={!cronInput.trim()}
              >
                Parse Expression
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

        {/* Presets */}
        <Card title="Common Presets" size="small">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Select a preset to use</Text>
              <Select
                placeholder="Choose a common cron expression"
                style={{ width: '100%' }}
                onChange={handlePresetSelect}
                value={undefined}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={presetOptions}
              />
            </Space>

            <div>
              <Text strong>Popular Presets:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {TEMP_CRON_PRESETS.slice(0, 8).map((preset: { name: string; expression: string }) => (
                    <Tag
                      key={preset.expression}
                      style={{ cursor: 'pointer', marginBottom: '4px' }}
                      onClick={() => handlePresetSelect(preset.expression)}
                    >
                      {preset.name}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Space>
        </Card>

        {/* Help Section */}
        <Card title="Cron Expression Format" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              Cron expressions consist of five fields separated by spaces:
            </Paragraph>
            
            <div style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
              * * * * *<br/>
              │ │ │ │ │<br/>
              │ │ │ │ └─── day of week (0-6, Sunday=0)<br/>
              │ │ │ └───── month (1-12)<br/>
              │ │ └─────── day of month (1-31)<br/>
              │ └───────── hour (0-23)<br/>
              └─────────── minute (0-59)
            </div>

            <Divider />

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Space direction="vertical" size="small">
                  <Text strong>Special Characters:</Text>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li><code>*</code> - Any value</li>
                    <li><code>,</code> - Value list (e.g., 1,3,5)</li>
                    <li><code>-</code> - Range (e.g., 1-5)</li>
                    <li><code>/</code> - Step values (e.g., */5)</li>
                  </ul>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space direction="vertical" size="small">
                  <Text strong>Special Strings:</Text>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li><code>@yearly</code> - Once a year (0 0 1 1 *)</li>
                    <li><code>@monthly</code> - Once a month (0 0 1 * *)</li>
                    <li><code>@weekly</code> - Once a week (0 0 * * 0)</li>
                    <li><code>@daily</code> - Once a day (0 0 * * *)</li>
                    <li><code>@hourly</code> - Once an hour (0 * * * *)</li>
                  </ul>
                </Space>
              </Col>
            </Row>

            <Divider />

            <Space direction="vertical" size="small">
              <Text strong>Examples:</Text>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><code>0 9 * * 1-5</code> - Every weekday at 9:00 AM</li>
                <li><code>*/15 * * * *</code> - Every 15 minutes</li>
                <li><code>0 0 1 * *</code> - First day of every month at midnight</li>
                <li><code>0 2 * * 0</code> - Every Sunday at 2:00 AM</li>
                <li><code>30 6 * * 1,3,5</code> - Monday, Wednesday, Friday at 6:30 AM</li>
              </ul>
            </Space>
          </Space>
        </Card>
      </Space>
    </ToolPageWrapper>
  );
};
