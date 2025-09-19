import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useTheme } from '../contexts/ThemeContext';

interface CodeEditorComponentProps {
  value: string;
  onChange?: (value: string) => void;
  language: 'json' | 'xml';
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  style?: React.CSSProperties;
}

export const CodeEditorComponent: React.FC<CodeEditorComponentProps> = ({
  value,
  onChange,
  language,
  placeholder,
  readOnly = false,
  rows = 8,
  style = {}
}) => {
  const { isDark } = useTheme();
  
  const lightTheme = {
    backgroundColor: readOnly ? '#f5f5f5' : '#ffffff',
    color: '#000000',
    borderColor: '#d9d9d9'
  };
  
  const darkTheme = {
    backgroundColor: readOnly ? '#1f1f1f' : '#141414',
    color: '#ffffff',
    borderColor: '#434343'
  };
  
  const theme = isDark ? darkTheme : lightTheme;
  
  const baseStyle: React.CSSProperties = {
    fontSize: '14px',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '6px',
    minHeight: `${rows * 1.5}em`,
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    ...style
  };

  return (
    <CodeEditor
      value={value}
      language={language}
      placeholder={placeholder}
      onChange={(evn) => onChange?.(evn.target.value)}
      data-color-mode={isDark ? 'dark' : 'light'}
      readOnly={readOnly}
      style={baseStyle}
    />
  );
};