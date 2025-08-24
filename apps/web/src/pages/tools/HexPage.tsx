import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, message, Row, Col } from 'antd';
import { CopyOutlined, ClearOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import {
  hexToAscii,
  asciiToHex,
  hexToBinary,
  binaryToHex,
  hexToDecimal,
  decimalToHex,
} from '@devtools/core';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

type ConversionType = 'hex-to-ascii' | 'ascii-to-hex' | 'hex-to-binary' | 'binary-to-hex' | 'hex-to-decimal' | 'decimal-to-hex';

interface ConversionResult {
  input: string;
  output: string;
  type: ConversionType;
}

export const HexPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);


  const conversions: Array<{
    key: ConversionType;
    label: string;
    converter: (input: string) => string;
    placeholder: string;
  }> = [
    {
      key: 'hex-to-ascii',
      label: 'Hex to ASCII',
      converter: hexToAscii,
      placeholder: 'Enter hex (e.g., 48656C6C6F)',
    },
    {
      key: 'ascii-to-hex',
      label: 'ASCII to Hex',
      converter: asciiToHex,
      placeholder: 'Enter text (e.g., Hello)',
    },
    {
      key: 'hex-to-binary',
      label: 'Hex to Binary',
      converter: hexToBinary,
      placeholder: 'Enter hex (e.g., FF)',
    },
    {
      key: 'binary-to-hex',
      label: 'Binary to Hex',
      converter: binaryToHex,
      placeholder: 'Enter binary (e.g., 11111111)',
    },
    {
      key: 'hex-to-decimal',
      label: 'Hex to Decimal',
      converter: (input: string) => hexToDecimal(input).toString(),
      placeholder: 'Enter hex (e.g., FF)',
    },
    {
      key: 'decimal-to-hex',
      label: 'Decimal to Hex',
      converter: (input: string) => {
        const num = parseInt(input, 10);
        if (isNaN(num)) throw new Error('Invalid decimal number');
        return decimalToHex(num);
      },
      placeholder: 'Enter decimal (e.g., 255)',
    },
  ];

  const handleConvert = () => {
    if (!input.trim()) {
      setResults([]);
      return;
    }

    const newResults: ConversionResult[] = [];

    conversions.forEach(({ key, converter }) => {
      try {
        const output = converter(input.trim());
        newResults.push({
          input: input.trim(),
          output,
          type: key,
        });
      } catch (error) {
        // Skip conversions that fail
      }
    });

    setResults(newResults);
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
    setInput('');
    setResults([]);
  };

  // Auto-convert on input change
  React.useEffect(() => {
    const timer = setTimeout(handleConvert, 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Hex Converter - DevTools</title>
        <meta 
          name="description" 
          content="Free online hex converter. Convert between hexadecimal, ASCII, binary, and decimal formats." 
        />
        <meta 
          name="keywords" 
          content="hex, hexadecimal, ascii, binary, decimal, converter, online tool" 
        />
      </Helmet>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Hex Converter</Title>
          <Paragraph>
            Convert between hexadecimal, ASCII, binary, and decimal formats. 
            Enter any value and see all possible conversions automatically.
          </Paragraph>
        </div>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Typography.Text strong>Input</Typography.Text>
                  <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter hex, text, binary, or decimal..."
                    rows={4}
                    style={{ fontFamily: 'monospace' }}
                  />
                </Space>
              </Col>

              <Col xs={24} lg={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Typography.Text strong>Conversions</Typography.Text>
                  {results.length > 0 ? (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {results.map((result) => {
                        const conversion = conversions.find(c => c.key === result.type);
                        return (
                          <Card 
                            key={result.type} 
                            size="small"
                            title={conversion?.label}
                            extra={
                              <Button
                                type="link"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(result.output)}
                              >
                                Copy
                              </Button>
                            }
                          >
                            <Typography.Text
                              code
                              style={{ wordBreak: 'break-all' }}
                            >
                              {result.output}
                            </Typography.Text>
                          </Card>
                        );
                      })}
                    </Space>
                  ) : (
                    <div style={{ 
                      padding: '24px',
                      textAlign: 'center',
                      color: '#999',
                      fontStyle: 'italic'
                    }}>
                      Enter a value to see conversions
                    </div>
                  )}
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

        <Card title="About Hexadecimal" size="small">
          <Space direction="vertical" size="small">
            <Paragraph>
              Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F. 
              It's commonly used in programming and computer science.
            </Paragraph>
            <ul>
              <li>Each hex digit represents 4 binary digits (bits)</li>
              <li>Two hex digits can represent values 0-255 (one byte)</li>
              <li>Commonly used for color codes, memory addresses, and data encoding</li>
              <li>Case-insensitive: 'FF' = 'ff' = 255 decimal</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </ToolPageWrapper>
  );
};
