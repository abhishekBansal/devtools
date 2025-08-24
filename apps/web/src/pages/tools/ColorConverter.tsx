import React, { useState } from 'react';
import { Card, Input, Row, Col, Typography, Space, Button, message, Tabs, InputNumber } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { 
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  analyzeColor,
  type ColorAnalysis
} from '@devtools/core';

const { Title } = Typography;

const ColorConverterTool: React.FC = () => {
  const [hexInput, setHexInput] = useState('#FF0000');
  const [rgbInput, setRgbInput] = useState({ r: 255, g: 0, b: 0 });
  const [hslInput, setHslInput] = useState({ h: 0, s: 100, l: 50 });
  const [analysis, setAnalysis] = useState<ColorAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('hex');


  const updateFromHex = (hex: string) => {
    try {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const colorAnalysis = analyzeColor(hex);
      
      setRgbInput(rgb);
      setHslInput(hsl);
      setAnalysis(colorAnalysis);
    } catch (error) {
      // Keep existing values if conversion fails
    }
  };

  const updateFromRgb = (rgb: { r: number; g: number; b: number }) => {
    try {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const colorAnalysis = analyzeColor(hex);
      
      setHexInput(hex);
      setHslInput(hsl);
      setAnalysis(colorAnalysis);
    } catch (error) {
      // Keep existing values if conversion fails
    }
  };

  const updateFromHsl = (hsl: { h: number; s: number; l: number }) => {
    try {
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      updateFromRgb(rgb);
    } catch (error) {
      // Keep existing values if conversion fails
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

  const hexPanel = (
    <Card title="Hex Color" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            updateFromHex(e.target.value);
          }}
          placeholder="#FF0000"
          addonBefore="#"
          style={{ fontFamily: 'monospace' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: hexInput,
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          />
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => copyToClipboard(hexInput)}
          >
            Copy
          </Button>
        </div>
      </Space>
    </Card>
  );

  const rgbPanel = (
    <Card title="RGB Color" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={8}>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Red (0-255):</div>
            <InputNumber
              min={0}
              max={255}
              value={rgbInput.r}
              onChange={(value) => {
                const newRgb = { ...rgbInput, r: value || 0 };
                setRgbInput(newRgb);
                updateFromRgb(newRgb);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Green (0-255):</div>
            <InputNumber
              min={0}
              max={255}
              value={rgbInput.g}
              onChange={(value) => {
                const newRgb = { ...rgbInput, g: value || 0 };
                setRgbInput(newRgb);
                updateFromRgb(newRgb);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Blue (0-255):</div>
            <InputNumber
              min={0}
              max={255}
              value={rgbInput.b}
              onChange={(value) => {
                const newRgb = { ...rgbInput, b: value || 0 };
                setRgbInput(newRgb);
                updateFromRgb(newRgb);
              }}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'monospace' }}>
            rgb({rgbInput.r}, {rgbInput.g}, {rgbInput.b})
          </span>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => copyToClipboard(`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`)}
          >
            Copy
          </Button>
        </div>
      </Space>
    </Card>
  );

  const hslPanel = (
    <Card title="HSL Color" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={8}>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Hue (0-360):</div>
            <InputNumber
              min={0}
              max={360}
              value={hslInput.h}
              onChange={(value) => {
                const newHsl = { ...hslInput, h: value || 0 };
                setHslInput(newHsl);
                updateFromHsl(newHsl);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Saturation (0-100):</div>
            <InputNumber
              min={0}
              max={100}
              value={hslInput.s}
              onChange={(value) => {
                const newHsl = { ...hslInput, s: value || 0 };
                setHslInput(newHsl);
                updateFromHsl(newHsl);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: '4px' }}>Lightness (0-100):</div>
            <InputNumber
              min={0}
              max={100}
              value={hslInput.l}
              onChange={(value) => {
                const newHsl = { ...hslInput, l: value || 0 };
                setHslInput(newHsl);
                updateFromHsl(newHsl);
              }}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'monospace' }}>
            hsl({hslInput.h}°, {hslInput.s}%, {hslInput.l}%)
          </span>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => copyToClipboard(`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`)}
          >
            Copy
          </Button>
        </div>
      </Space>
    </Card>
  );

  const tabItems = [
    { key: 'hex', label: 'Hex', children: hexPanel },
    { key: 'rgb', label: 'RGB', children: rgbPanel },
    { key: 'hsl', label: 'HSL', children: hslPanel }
  ];

  return (
    <ToolPageWrapper>
      <Helmet>
        <title>Color Converter - Devtools</title>
        <meta 
          name="description" 
          content="Convert colors between different formats (Hex, RGB, HSL, HSV, CMYK) and analyze color properties and accessibility." 
        />
      </Helmet>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>Color Converter</Title>
        <p>Convert colors between different formats and analyze color properties.</p>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
            />
          </Col>

          <Col xs={24} lg={12}>
            {analysis && (
              <Card title="Color Analysis" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: analysis.hex,
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px'
                      }}
                    />
                    <div>
                      <div><strong>Current Color</strong></div>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{analysis.hex}</div>
                    </div>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>Hex:</strong> {analysis.hex}</div>
                    </Col>
                    <Col span={12}>
                      <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => copyToClipboard(analysis.hex)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>RGB:</strong> {analysis.rgb.r}, {analysis.rgb.g}, {analysis.rgb.b}</div>
                    </Col>
                    <Col span={12}>
                      <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => copyToClipboard(`rgb(${analysis.rgb.r}, ${analysis.rgb.g}, ${analysis.rgb.b})`)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>HSL:</strong> {analysis.hsl.h}°, {analysis.hsl.s}%, {analysis.hsl.l}%</div>
                    </Col>
                    <Col span={12}>
                      <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => copyToClipboard(`hsl(${analysis.hsl.h}, ${analysis.hsl.s}%, ${analysis.hsl.l}%)`)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>HSV:</strong> {analysis.hsv.h}°, {analysis.hsv.s}%, {analysis.hsv.v}%</div>
                    </Col>
                    <Col span={12}>
                      <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => copyToClipboard(`hsv(${analysis.hsv.h}, ${analysis.hsv.s}%, ${analysis.hsv.v}%)`)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div><strong>CMYK:</strong> {analysis.cmyk.c}%, {analysis.cmyk.m}%, {analysis.cmyk.y}%, {analysis.cmyk.k}%</div>
                    </Col>
                    <Col span={12}>
                      <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={() => copyToClipboard(`cmyk(${analysis.cmyk.c}%, ${analysis.cmyk.m}%, ${analysis.cmyk.y}%, ${analysis.cmyk.k}%)`)}
                      />
                    </Col>
                  </Row>

                  <div style={{ marginTop: '16px' }}>
                    <Title level={5}>Accessibility</Title>
                    <div><strong>Luminance:</strong> {analysis.luminance.toFixed(3)}</div>
                    <div><strong>Contrast vs White:</strong> {analysis.contrast.white.toFixed(2)}</div>
                    <div><strong>Contrast vs Black:</strong> {analysis.contrast.black.toFixed(2)}</div>
                    <div><strong>WCAG AA:</strong> {analysis.accessibility.aa ? '✅ Pass' : '❌ Fail'}</div>
                    <div><strong>WCAG AAA:</strong> {analysis.accessibility.aaa ? '✅ Pass' : '❌ Fail'}</div>
                  </div>
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
                <li>Convert between Hex, RGB, HSL, HSV, and CMYK color formats</li>
                <li>Real-time color preview with visual feedback</li>
                <li>Accessibility analysis with WCAG compliance checking</li>
                <li>Copy any color format to clipboard with one click</li>
              </ul>
            </div>
            <div>
              <strong>Use cases:</strong>
              <ul>
                <li><strong>Web Development:</strong> Convert colors for CSS and design systems</li>
                <li><strong>Graphic Design:</strong> Match colors across different software</li>
                <li><strong>Accessibility:</strong> Check color contrast ratios for compliance</li>
                <li><strong>Print Design:</strong> Convert RGB to CMYK for printing</li>
                <li><strong>Brand Guidelines:</strong> Maintain consistent colors across platforms</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </ToolPageWrapper>
  );
};

export default ColorConverterTool;
