import React, { useState } from 'react';
import { Card, Button, Space, Typography, message, Alert } from 'antd';
import { CopyOutlined, ClearOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { validateJson, formatJson, minifyJson } from '@devtools/core';
import { ToolPageWrapper } from '../../components/ToolPageWrapper';
import { CodeEditorComponent } from '../../components/CodeEditor';

const { Title, Paragraph } = Typography;

export const JsonPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
  } | null>(null);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = formatJson(input, 2);
      setOutput(result);
      message.success('JSON formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Formatting failed';
      message.error(errorMessage);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = minifyJson(input);
      setOutput(result);
      message.success('JSON minified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Minification failed';
      message.error(errorMessage);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      message.success('Copied to clipboard!');
    } catch {
      message.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setValidationResult(null);
  };

  // Auto-validate on input change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setValidationResult(null);
        return;
      }

      const result = validateJson(input);
      setValidationResult(result);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>JSON Validator & Formatter - DevTools</title>
        <meta 
          name="description" 
          content="Free online JSON validator, formatter, and minifier. Validate JSON syntax and format JSON with proper indentation." 
        />
        <meta 
          name="keywords" 
          content="json, validate, format, minify, json validator, json formatter, json parser, online tool" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>JSON Validator & Formatter</Title>
          <Paragraph>
            Validate JSON syntax, format with proper indentation, or minify by removing whitespace.
            Real-time validation shows errors as you type.
          </Paragraph>
        </div>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Input Section */}
            <div>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Typography.Text strong>JSON Input</Typography.Text>
                <CodeEditorComponent
                  value={input}
                  onChange={setInput}
                  language="json"
                  placeholder='Enter JSON here... e.g., {"name": "example", "value": 123}'
                  rows={10}
                />
                
                {validationResult && (
                  <Alert
                    type={validationResult.isValid ? 'success' : 'error'}
                    icon={validationResult.isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    message={
                      validationResult.isValid 
                        ? 'Valid JSON' 
                        : `Invalid JSON: ${validationResult.error}`
                    }
                    showIcon
                  />
                )}
              </Space>
            </div>

            {/* Action Buttons */}
            <Space wrap>
              <Button 
                type="primary" 
                onClick={handleFormat}
                disabled={!input.trim() || !validationResult?.isValid}
              >
                Format
              </Button>
              <Button 
                onClick={handleMinify}
                disabled={!input.trim() || !validationResult?.isValid}
              >
                Minify
              </Button>
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClear}
              >
                Clear
              </Button>
            </Space>

            {/* Output Section */}
            <div>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <Typography.Text strong>Output</Typography.Text>
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
                <CodeEditorComponent
                  value={output}
                  language="json"
                  readOnly
                  rows={10}
                />
              </Space>
            </div>
          </Space>
        </Card>

        <Card title="About JSON" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              JSON (JavaScript Object Notation) is a lightweight data interchange format. 
              It's easy for humans to read and write, and easy for machines to parse and generate.
            </Paragraph>
            <ul>
              <li>Supports strings, numbers, booleans, null, objects, and arrays</li>
              <li>Keys must be strings in double quotes</li>
              <li>No trailing commas allowed</li>
              <li>No comments allowed in pure JSON</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </ToolPageWrapper>
  );
};
