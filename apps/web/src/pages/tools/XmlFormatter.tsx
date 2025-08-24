import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Space, Button, message, Select, Alert } from 'antd';
import { CopyOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { validateXml, formatXml, minifyXml, analyzeXml, type XmlValidationResult } from '@devtools/core';
import ToolPageWrapper from '../../components/ToolPageWrapper';

const { Title } = Typography;
const { TextArea } = Input;

const XmlFormatterTool: React.FC = () => {
  const [inputXml, setInputXml] = useState('');
  const [outputXml, setOutputXml] = useState('');
  const [validation, setValidation] = useState<XmlValidationResult | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [operation, setOperation] = useState<'format' | 'minify' | 'validate'>('format');

  // Tracking handled by wrapper

  const handleInputChange = (value: string) => {
    setInputXml(value);
    
    if (value.trim()) {
      // Always validate first
      const validationResult = validateXml(value);
      setValidation(validationResult);
      
      if (validationResult.valid) {
        try {
          // Perform analysis
          const analysisResult = analyzeXml(value);
          setAnalysis(analysisResult);
          
          // Perform the selected operation
          switch (operation) {
            case 'format':
              const formatted = formatXml(value, indentSize);
              setOutputXml(formatted);
              break;
            case 'minify':
              const minified = minifyXml(value);
              setOutputXml(minified);
              break;
            case 'validate':
              setOutputXml(''); // No output for validation
              break;
          }
        } catch (error) {
          setOutputXml('');
          setAnalysis(null);
        }
      } else {
        setOutputXml('');
        setAnalysis(null);
      }
    } else {
      setValidation(null);
      setOutputXml('');
      setAnalysis(null);
    }
  };

  const handleOperationChange = (newOperation: 'format' | 'minify' | 'validate') => {
    setOperation(newOperation);
    if (inputXml.trim() && validation?.valid) {
      try {
        switch (newOperation) {
          case 'format':
            const formatted = formatXml(inputXml, indentSize);
            setOutputXml(formatted);
            break;
          case 'minify':
            const minified = minifyXml(inputXml);
            setOutputXml(minified);
            break;
          case 'validate':
            setOutputXml('');
            break;
        }
      } catch (error) {
        setOutputXml('');
      }
    }
  };

  const handleIndentChange = (newIndentSize: number) => {
    setIndentSize(newIndentSize);
    if (operation === 'format' && inputXml.trim() && validation?.valid) {
      try {
        const formatted = formatXml(inputXml, newIndentSize);
        setOutputXml(formatted);
      } catch (error) {
        setOutputXml('');
      }
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

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>XML Formatter - Devtools</title>
        <meta 
          name="description" 
          content="Format, validate, and minify XML documents with proper indentation and error checking." 
        />
      </Helmet>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>XML Formatter</Title>
        <p>Validate, format, and minify XML documents with comprehensive analysis.</p>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card 
              title="Input XML" 
              size="small"
              extra={
                <Space>
                  <Select
                    value={operation}
                    onChange={handleOperationChange}
                    style={{ width: 120 }}
                    options={[
                      { value: 'format', label: 'Format' },
                      { value: 'minify', label: 'Minify' },
                      { value: 'validate', label: 'Validate' }
                    ]}
                  />
                  {operation === 'format' && (
                    <Select
                      value={indentSize}
                      onChange={handleIndentChange}
                      style={{ width: 80 }}
                      options={[
                        { value: 2, label: '2' },
                        { value: 4, label: '4' },
                        { value: 8, label: '8' }
                      ]}
                    />
                  )}
                </Space>
              }
            >
              <TextArea
                value={inputXml}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Paste your XML here..."
                rows={15}
                style={{ fontFamily: 'monospace' }}
              />
            </Card>

            {validation && (
              <Card size="small" style={{ marginTop: '16px' }}>
                <Space align="center">
                  {validation.valid ? (
                    <>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <span style={{ color: '#52c41a' }}>Valid XML</span>
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      <span style={{ color: '#ff4d4f' }}>Invalid XML</span>
                    </>
                  )}
                </Space>
                {!validation.valid && validation.error && (
                  <Alert
                    message="Validation Error"
                    description={validation.error}
                    type="error"
                    style={{ marginTop: '8px' }}
                    showIcon
                  />
                )}
              </Card>
            )}
          </Col>

          <Col xs={24} lg={12}>
            {operation !== 'validate' && (
              <Card 
                title={`${operation === 'format' ? 'Formatted' : 'Minified'} XML`}
                size="small"
                extra={
                  outputXml && (
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => copyToClipboard(outputXml)}
                    >
                      Copy
                    </Button>
                  )
                }
              >
                <TextArea
                  value={outputXml}
                  readOnly
                  rows={15}
                  style={{ 
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5'
                  }}
                  placeholder={validation?.valid ? 'Processed XML will appear here...' : 'Fix XML errors to see output'}
                />
              </Card>
            )}

            {analysis && (
              <Card title="XML Analysis" size="small" style={{ marginTop: operation === 'validate' ? '0' : '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>Elements:</strong> {analysis.elements}</div>
                    </Col>
                    <Col span={12}>
                      <div><strong>Attributes:</strong> {analysis.attributes}</div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>Text Nodes:</strong> {analysis.textNodes}</div>
                    </Col>
                    <Col span={12}>
                      <div><strong>Comments:</strong> {analysis.comments}</div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>Max Depth:</strong> {analysis.depth}</div>
                    </Col>
                  </Row>
                </Space>
              </Card>
            )}
          </Col>
        </Row>

        <Card title="Usage Examples" size="small" style={{ marginTop: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>Features:</strong>
              <ul>
                <li><strong>Format:</strong> Add proper indentation and line breaks for readability</li>
                <li><strong>Minify:</strong> Remove unnecessary whitespace to reduce file size</li>
                <li><strong>Validate:</strong> Check XML syntax and structure for errors</li>
                <li><strong>Analyze:</strong> Get detailed statistics about your XML document</li>
              </ul>
            </div>
            <div>
              <strong>Use cases:</strong>
              <ul>
                <li>API response formatting</li>
                <li>Configuration file validation</li>
                <li>XML schema validation</li>
                <li>Document transformation</li>
                <li>Data interchange format verification</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </ToolPageWrapper>
  );
};

export default XmlFormatterTool;
