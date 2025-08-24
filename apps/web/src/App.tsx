import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Base64Page } from './pages/tools/Base64Page';
import { JsonPage } from './pages/tools/JsonPage';
import { UuidPage } from './pages/tools/UuidPage';
import { HexPage } from './pages/tools/HexPage';
import { TimestampPage } from './pages/tools/TimestampPage';
import { CronPage } from './pages/tools/CronPage';
import StringAnalyzerTool from './pages/tools/StringAnalyzer';
import StringCaseConverterTool from './pages/tools/StringCaseConverter';
import XmlFormatterTool from './pages/tools/XmlFormatter';
import ColorConverterTool from './pages/tools/ColorConverter';
import 'antd/dist/reset.css';

const { Content } = Layout;

const AppContent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  // Add theme class to document element for CSS targeting
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          // Ensure proper input colors
          colorText: isDark
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(0, 0, 0, 0.88)',
          colorBgContainer: isDark ? '#141414' : '#ffffff',
          colorBorder: isDark ? '#424242' : '#d9d9d9',
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <Content
          style={{
            flex: 1,
            padding: '24px',
            background: isDark ? '#141414' : '#f5f5f5',
            minHeight: 'calc(100vh - 128px)',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              background: isDark ? '#1f1f1f' : '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              minHeight: '100%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/tools/base64-encoder-decoder"
                element={<Base64Page />}
              />
              <Route
                path="/tools/json-validator-formatter"
                element={<JsonPage />}
              />
              <Route path="/tools/uuid-generator" element={<UuidPage />} />
              <Route path="/tools/hex-text-converter" element={<HexPage />} />
              <Route
                path="/tools/timestamp-converter"
                element={<TimestampPage />}
              />
              <Route
                path="/tools/cron-expression-parser"
                element={<CronPage />}
              />
              <Route
                path="/tools/string-analyzer"
                element={<StringAnalyzerTool />}
              />
              <Route
                path="/tools/string-case-converter"
                element={<StringCaseConverterTool />}
              />
              <Route
                path="/tools/xml-formatter"
                element={<XmlFormatterTool />}
              />
              <Route
                path="/tools/color-converter"
                element={<ColorConverterTool />}
              />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
