import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Divider, Space } from 'antd';
import { Helmet } from 'react-helmet-async';
import { analyzeString, type StringAnalysis } from '@devtools/core';
import ToolPageWrapper from '../../components/ToolPageWrapper';

const { Title } = Typography;
const { TextArea } = Input;

const StringAnalyzerTool: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<StringAnalysis | null>(null);


  const handleTextChange = (value: string) => {
    setText(value);
    if (value) {
      try {
        const result = analyzeString(value);
        setAnalysis(result);
      } catch (error) {
        setAnalysis(null);
      }
    } else {
      setAnalysis(null);
    }
  };

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>String Analyzer - Devtools</title>
        <meta 
          name="description" 
          content="Analyze text strings to get detailed statistics including character count, word count, sentence count, and more." 
        />
      </Helmet>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>String Analyzer</Title>
        <p>Analyze text strings to get comprehensive statistics and insights.</p>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="Input Text" size="small">
              <TextArea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text to analyze..."
                rows={10}
                style={{ fontFamily: 'monospace' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Analysis Results" size="small">
              {analysis ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Length:</strong> {analysis.length}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Characters:</strong> {analysis.characters}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Characters (no spaces):</strong> {analysis.charactersNoSpaces}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Words:</strong> {analysis.words}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Lines:</strong> {analysis.lines}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Paragraphs:</strong> {analysis.paragraphs}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Sentences:</strong> {analysis.sentences}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Bytes (UTF-8):</strong> {analysis.bytes}
                      </div>
                    </Col>
                  </Row>

                  <Divider />

                  <Title level={5}>Character Types</Title>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Letters:</strong> {analysis.letters}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Digits:</strong> {analysis.digits}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Uppercase:</strong> {analysis.uppercase}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Lowercase:</strong> {analysis.lowercase}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <strong>Whitespace:</strong> {analysis.whitespace}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>Special chars:</strong> {analysis.specialChars}
                      </div>
                    </Col>
                  </Row>
                </Space>
              ) : (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                  Enter text to see analysis results
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Card title="Usage Examples" size="small" style={{ marginTop: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>Use cases:</strong>
              <ul>
                <li>Content writing - check word and character counts</li>
                <li>Social media posts - verify character limits</li>
                <li>Code analysis - analyze string properties</li>
                <li>Document statistics - get detailed text metrics</li>
                <li>Data validation - check text composition</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </ToolPageWrapper>
  );
};

export default StringAnalyzerTool;
