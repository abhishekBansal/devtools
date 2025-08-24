import React from 'react';
import { Layout, Space } from 'antd';
import { useToolTracker } from '../hooks/useToolTracker';

const { Content } = Layout;

interface ToolPageWrapperProps {
  children: React.ReactNode;
  /** Additional CSS class name for styling */
  className?: string;
  /** Custom spacing between elements */
  spacing?: 'small' | 'middle' | 'large' | number;
  /** Whether to apply default padding */
  withPadding?: boolean;
}

/**
 * Common wrapper component for all tool pages.
 * Handles:
 * - Tool usage tracking
 * - Consistent layout and spacing
 * - Future common functionality (analytics, error boundaries, etc.)
 */
export const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({
  children,
  className,
  spacing = 'large',
  withPadding = true,
}) => {
  // Track tool usage automatically
  useToolTracker();

  return (
    <Content 
      className={className}
      style={{
        padding: withPadding ? '24px' : 0,
        minHeight: '100vh',
      }}
    >
      <Space 
        direction="vertical" 
        size={spacing} 
        style={{ width: '100%' }}
      >
        {children}
      </Space>
    </Content>
  );
};

export default ToolPageWrapper;
