import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Select, Space, Button, Divider, Badge, Tooltip } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CopyOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import { 
  diffText, 
  createUnifiedDiff,
  type DiffMode,
  type DiffResult 
} from '@devtools/core';
import ToolPageWrapper from '../../components/ToolPageWrapper';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TextDiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffMode, setDiffMode] = useState<DiffMode>('line');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [unifiedDiff, setUnifiedDiff] = useState<string>('');

  const handleTextChange = () => {
    if (text1 || text2) {
      try {
        const result = diffText(text1, text2, diffMode);
        setDiffResult(result);
        
        if (diffMode === 'line') {
          const unified = createUnifiedDiff(text1, text2, 'Original', 'Modified');
          setUnifiedDiff(unified);
        } else {
          setUnifiedDiff('');
        }
      } catch (error) {
        setDiffResult(null);
        setUnifiedDiff('');
      }
    } else {
      setDiffResult(null);
      setUnifiedDiff('');
    }
  };

  React.useEffect(() => {
    handleTextChange();
  }, [text1, text2, diffMode]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiffResult(null);
    setUnifiedDiff('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added': return '#52c41a';   // Ant Design green
      case 'removed': return '#ff4d4f'; // Ant Design red
      case 'modified': return '#1890ff'; // Ant Design blue
      case 'unchanged': return '#8c8c8c'; // Ant Design gray
      default: return '#8c8c8c';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'added': return '#f6ffed';    // Light green background
      case 'removed': return '#fff2f0';  // Light red background
      case 'modified': return '#e6f7ff'; // Light blue background
      case 'unchanged': return 'transparent';
      default: return 'transparent';
    }
  };

  const getTypeSymbol = (type: string) => {
    switch (type) {
      case 'added': return '+';
      case 'removed': return '-';
      case 'modified': return '~';
      case 'unchanged': return ' ';
      default: return ' ';
    }
  };

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Text Diff Tool - Devtools</title>
        <meta 
          name="description" 
          content="Compare two text files and visualize differences with line-by-line, word-by-word, or character-by-character comparison modes." 
        />
      </Helmet>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Title level={2}>Text Diff Tool</Title>
        <p>Compare two texts and visualize differences with various comparison modes.</p>

        {/* Controls */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Space>
            <span>Comparison Mode:</span>
            <Select 
              value={diffMode} 
              onChange={setDiffMode}
              style={{ width: 120 }}
            >
              <Option value="line">Line</Option>
              <Option value="word">Word</Option>
              <Option value="character">Character</Option>
            </Select>
            <Button onClick={clearAll} size="small">Clear All</Button>
          </Space>
        </Card>

        {/* Input Areas */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <FileTextOutlined />
                  Original Text
                </Space>
              } 
              size="small"
              extra={
                text1 && (
                  <Tooltip title="Copy to clipboard">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={() => copyToClipboard(text1)}
                    />
                  </Tooltip>
                )
              }
            >
              <TextArea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter original text..."
                rows={12}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <FileTextOutlined />
                  Modified Text
                </Space>
              } 
              size="small"
              extra={
                text2 && (
                  <Tooltip title="Copy to clipboard">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={() => copyToClipboard(text2)}
                    />
                  </Tooltip>
                )
              }
            >
              <TextArea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter modified text..."
                rows={12}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Results */}
        {diffResult && (
          <Row gutter={16}>
            {/* Statistics */}
            <Col xs={24} lg={8}>
              <Card title="Diff Statistics" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <strong>Similarity:</strong> 
                    <Badge 
                      count={`${diffResult.similarity}%`} 
                      style={{ 
                        backgroundColor: diffResult.similarity > 70 ? '#52c41a' : 
                                        diffResult.similarity > 40 ? '#fadb14' : '#ff4d4f',
                        marginLeft: '8px'
                      }} 
                    />
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div style={{ color: getTypeColor('added'), fontWeight: '500' }}>
                    <strong>Added:</strong> {diffResult.stats.added}
                  </div>
                  <div style={{ color: getTypeColor('removed'), fontWeight: '500' }}>
                    <strong>Removed:</strong> {diffResult.stats.removed}
                  </div>
                  <div style={{ color: getTypeColor('modified'), fontWeight: '500' }}>
                    <strong>Modified:</strong> {diffResult.stats.modified}
                  </div>
                  <div style={{ color: getTypeColor('unchanged'), fontWeight: '500' }}>
                    <strong>Unchanged:</strong> {diffResult.stats.unchanged}
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <strong>Total Items:</strong> {diffResult.stats.totalLines}
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Diff View */}
            <Col xs={24} lg={16}>
              <Card 
                title={
                  <Space>
                    <HistoryOutlined />
                    Diff View ({diffMode} mode)
                  </Space>
                }
                size="small"
                extra={
                  diffResult.lines.length > 0 && (
                    <Tooltip title="Copy diff to clipboard">
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        size="small"
                        onClick={() => {
                          const diffText = diffResult.lines
                            .map(line => `${getTypeSymbol(line.type)} ${line.content}`)
                            .join('\n');
                          copyToClipboard(diffText);
                        }}
                      />
                    </Tooltip>
                  )
                }
              >
                <div 
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                    padding: '16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {diffResult.lines.length > 0 ? (
                    diffResult.lines.map((line, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getTypeBgColor(line.type),
                          borderLeft: `4px solid ${getTypeColor(line.type)}`,
                          marginBottom: '2px',
                          borderRadius: '2px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span 
                          style={{ 
                            color: getTypeColor(line.type), 
                            marginRight: '12px',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          {getTypeSymbol(line.type)}
                        </span>
                        <span style={{ fontFamily: 'inherit' }}>
                          {line.content || <em style={{ color: '#bfbfbf' }}>(empty line)</em>}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      color: '#52c41a', 
                      fontStyle: 'italic',
                      textAlign: 'center',
                      padding: '24px',
                      backgroundColor: '#f6ffed',
                      border: '1px dashed #52c41a',
                      borderRadius: '6px'
                    }}>
                      ✅ No differences found - texts are identical
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Unified Diff (only for line mode) */}
        {unifiedDiff && diffMode === 'line' && (
          <Card 
            title="Unified Diff Format"
            size="small" 
            style={{ marginTop: '16px' }}
            extra={
              <Tooltip title="Copy unified diff to clipboard">
                <Button 
                  type="text" 
                  icon={<CopyOutlined />} 
                  size="small"
                  onClick={() => copyToClipboard(unifiedDiff)}
                />
              </Tooltip>
            }
          >
            <div 
              style={{ 
                fontFamily: 'monospace',
                fontSize: '13px',
                backgroundColor: '#fafafa',
                padding: '16px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                lineHeight: '1.5'
              }}
            >
              {unifiedDiff}
            </div>
          </Card>
        )}

        {/* Usage Examples */}
        <Card title="Usage Examples" size="small" style={{ marginTop: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>Use cases:</strong>
              <ul>
                <li><strong>Code Review:</strong> Compare different versions of code files</li>
                <li><strong>Document Editing:</strong> Track changes in text documents</li>
                <li><strong>Configuration Changes:</strong> Compare configuration files</li>
                <li><strong>Data Migration:</strong> Verify data transformations</li>
                <li><strong>Content Management:</strong> Review content changes before publishing</li>
              </ul>
            </div>
            
            <div>
              <strong>Comparison Modes:</strong>
              <ul>
                <li><strong>Line Mode:</strong> Compare text line by line (best for code and structured text)</li>
                <li><strong>Word Mode:</strong> Compare word by word (good for prose and documentation)</li>
                <li><strong>Character Mode:</strong> Compare character by character (precise but verbose)</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </ToolPageWrapper>
  );
};

export default TextDiffTool;
