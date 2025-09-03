import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Space, Button, Divider, Badge, Tooltip } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CopyOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import { 
  diffLinesWithInlineChanges, 
  createUnifiedDiff,
  type DiffLine
} from '@devtools/core';
import ToolPageWrapper from '../../components/ToolPageWrapper';

const { Title } = Typography;
const { TextArea } = Input;

const TextDiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [unifiedDiff, setUnifiedDiff] = useState<string>('');

  React.useEffect(() => {
    if (text1 || text2) {
      try {
        const result = diffLinesWithInlineChanges(text1, text2);
        setDiffLines(result);
        
        const unified = createUnifiedDiff(text1, text2, 'Original', 'Modified');
        setUnifiedDiff(unified);
      } catch {
        setDiffLines([]);
        setUnifiedDiff('');
      }
    } else {
      setDiffLines([]);
      setUnifiedDiff('');
    }
  }, [text1, text2]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiffLines([]);
    setUnifiedDiff('');
  };

  // Helper function to compute stats from diff lines
  const computeStats = (lines: DiffLine[]) => {
    const stats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
      totalLines: lines.length
    };

    lines.forEach(line => {
      switch (line.type) {
        case 'added':
          stats.added++;
          break;
        case 'removed':
          stats.removed++;
          break;
        case 'unchanged':
          stats.unchanged++;
          break;
      }
    });

    // Calculate similarity percentage
    const similarity = stats.totalLines > 0 
      ? Math.round((stats.unchanged / stats.totalLines) * 100)
      : 100;

    return { ...stats, similarity };
  };

  // Helper function to render a line with inline highlighting
  const renderLineWithInlineChanges = (line: DiffLine) => {
    if (!line.inlineChanges || line.inlineChanges.length === 0) {
      return <span>{line.content}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    line.inlineChanges.forEach((change, index) => {
      // Add text before this change
      if (change.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {line.content.slice(lastIndex, change.startIndex)}
          </span>
        );
      }

      // Add the highlighted change
      const changeText = line.content.slice(change.startIndex, change.endIndex);
      const highlightColor = change.type === 'added' ? '#b7eb8f' : '#ffccc7'; // Light green/red
      parts.push(
        <span
          key={`change-${index}`}
          style={{
            backgroundColor: highlightColor,
            padding: '1px 2px',
            borderRadius: '2px',
            fontWeight: 'bold'
          }}
        >
          {changeText}
        </span>
      );

      lastIndex = change.endIndex;
    });

    // Add remaining text after last change
    if (lastIndex < line.content.length) {
      parts.push(
        <span key="text-end">
          {line.content.slice(lastIndex)}
        </span>
      );
    }

    return <span>{parts}</span>;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added': return '#52c41a';   // Ant Design green
      case 'removed': return '#ff4d4f'; // Ant Design red
      case 'modified': return '#1890ff'; // Ant Design blue
      case 'unchanged': return '#8c8c8c'; // Ant Design gray
      default: return '#000000';
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

  const getLineBackgroundColor = (type: string) => {
    switch (type) {
      case 'added': return '#f6ffed';    // Very light green
      case 'removed': return '#fff2f0';  // Very light red
      case 'modified': return '#e6f7ff'; // Very light blue
      case 'unchanged': return '#fafafa'; // Very light gray
      default: return '#ffffff';
    }
  };

  const stats = diffLines.length > 0 ? computeStats(diffLines) : null;

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Text Diff Tool - DevTools</title>
        <meta name="description" content="Compare and visualize differences between two text blocks with inline highlighting" />
      </Helmet>

      <div style={{ padding: '20px' }}>
        <Title level={2}>
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Text Diff Tool
        </Title>

        {/* Input Areas */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title="Original Text" 
              size="small"
              extra={
                <Space>
                  <Tooltip title="Paste from clipboard">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setText1(text);
                        } catch (err) {
                          console.error('Failed to read clipboard:', err);
                        }
                      }}
                    />
                  </Tooltip>
                </Space>
              }
            >
              <TextArea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter the original text here..."
                rows={12}
                style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title="Modified Text" 
              size="small"
              extra={
                <Space>
                  <Tooltip title="Paste from clipboard">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setText2(text);
                        } catch (err) {
                          console.error('Failed to read clipboard:', err);
                        }
                      }}
                    />
                  </Tooltip>
                </Space>
              }
            >
              <TextArea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter the modified text here..."
                rows={12}
                style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row style={{ marginBottom: '20px' }}>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                onClick={() => {
                  setText1(
`Hello World
This is line 2
This is line 3`
                  );
                  setText2(
`Hello Universe
This is line 2 modified
This is line 3
This is line 4`
                  );
                }}
              >
                Load Example
              </Button>
              <Button onClick={clearAll}>
                Clear All
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Results */}
        {diffLines.length > 0 && stats && (
          <Row gutter={16}>
            {/* Statistics */}
            <Col xs={24} lg={8}>
              <Card title="Diff Statistics" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <strong>Similarity:</strong> 
                    <Badge 
                      count={`${stats.similarity}%`} 
                      style={{ 
                        backgroundColor: stats.similarity > 70 ? '#52c41a' : 
                                        stats.similarity > 40 ? '#fadb14' : '#ff4d4f',
                        marginLeft: '8px'
                      }} 
                    />
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div style={{ color: getTypeColor('added'), fontWeight: '500' }}>
                    <strong>Added:</strong> {stats.added}
                  </div>
                  <div style={{ color: getTypeColor('removed'), fontWeight: '500' }}>
                    <strong>Removed:</strong> {stats.removed}
                  </div>
                  <div style={{ color: getTypeColor('modified'), fontWeight: '500' }}>
                    <strong>Modified:</strong> {stats.modified}
                  </div>
                  <div style={{ color: getTypeColor('unchanged'), fontWeight: '500' }}>
                    <strong>Unchanged:</strong> {stats.unchanged}
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <strong>Total Items:</strong> {stats.totalLines}
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
                    Diff View (line mode with inline highlighting)
                  </Space>
                }
                size="small"
                extra={
                  diffLines.length > 0 && (
                    <Tooltip title="Copy diff to clipboard">
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        size="small"
                        onClick={() => {
                          const diffText = diffLines
                            .map((line: DiffLine) => `${getTypeSymbol(line.type)} ${line.content}`)
                            .join('\n');
                          copyToClipboard(diffText);
                        }}
                      />
                    </Tooltip>
                  )
                }
              >
                <div style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px'
                }}>
                  {diffLines.length > 0 ? (
                    diffLines.map((line: DiffLine, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getLineBackgroundColor(line.type),
                          borderLeft: `3px solid ${getTypeColor(line.type)}`,
                          fontFamily: 'Monaco, "Courier New", monospace',
                          fontSize: '13px',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                      >
                        <span style={{ 
                          color: getTypeColor(line.type), 
                          marginRight: '8px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          width: '20px'
                        }}>
                          {getTypeSymbol(line.type)}
                        </span>
                        {renderLineWithInlineChanges(line)}
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      padding: '20px', 
                      textAlign: 'center', 
                      color: '#8c8c8c' 
                    }}>
                      No differences found
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Unified Diff */}
        {unifiedDiff && (
          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Card 
                title="Unified Diff" 
                size="small"
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
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Monaco, "Courier New", monospace',
                  fontSize: '13px',
                  margin: 0,
                  padding: '12px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {unifiedDiff}
                </pre>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </ToolPageWrapper>
  );
};

export default TextDiffTool;
