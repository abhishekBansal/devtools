# Google Analytics Setup for GitHub Pages

This guide explains how to set up Google Analytics for the DevTools project specifically for GitHub Pages deployment.

## Overview

The Google Analytics implementation is designed to:
- **Only run in production** on GitHub Pages
- **Not track during development** to avoid polluting analytics data
- **Automatically track page views** and user interactions
- **Use environment variables** for secure configuration

## Setup Instructions

### 1. Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Set up a GA4 data stream for your website domain
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure GitHub Repository

1. Go to your GitHub repository settings
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Name: `GA_MEASUREMENT_ID`
5. Value: Your Google Analytics Measurement ID (e.g., `G-XXXXXXXXXX`)

### 3. Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Use the secret during build
- Inject the measurement ID into the production build
- Deploy to GitHub Pages with analytics enabled

## What Gets Tracked

### Automatic Tracking
- **Page Views**: Every route change
- **Theme Toggles**: When users switch between light/dark mode

### Tool-Specific Tracking
- **Tool Usage**: When users visit a tool page
- **Tool Actions**: When users perform operations (encode, decode, format, etc.)
- **Copy Actions**: When users copy results to clipboard
- **Clear Actions**: When users clear form data

### Search & Navigation
- **Search**: Tool search queries and result counts
- **Navigation**: Movement between different tools

## Implementation Details

### Analytics Utilities (`src/utils/analytics.ts`)
- Smart detection of production environment
- Domain validation to ensure tracking only on official sites
- Comprehensive event tracking functions
- Graceful degradation when analytics is disabled

### Environment Configuration
- **Development** (`.env.development`): No tracking
- **Production** (`.env.production`): Full tracking enabled
- **Build Time**: GA measurement ID injected via GitHub Actions

### Privacy & Performance
- **No PII Collection**: Only anonymous usage data
- **Minimal Impact**: Analytics loads after critical app functionality
- **Conditional Loading**: Only loads on production deployments

## Testing

### Local Development
- Analytics is **disabled** during development
- Console logs indicate analytics status
- No data is sent to Google Analytics

### Production Verification
1. Deploy to GitHub Pages
2. Open browser developer tools
3. Check Network tab for GA requests
4. Verify events in Google Analytics Real-time reports

## Analytics Events Reference

### Page Tracking
```typescript
trackPageView('/tools/base64-encoder-decoder', 'Base64 Tool')
```

### Tool Usage
```typescript
trackToolUsage('Base64', 'page_view')
trackToolAction('Base64', 'encode')
trackCopy('Base64', 'result')
trackClear('Base64')
```

### UI Interactions
```typescript
trackThemeToggle('dark')
trackSearch('json', 5)
```

## Troubleshooting

### Analytics Not Working
1. **Check GitHub Secret**: Ensure `GA_MEASUREMENT_ID` is set correctly
2. **Verify Domain**: Analytics only runs on `tools.abhishekbansal.dev` or `*.github.io`
3. **Check Console**: Look for initialization messages in browser console
4. **Validate Build**: Ensure environment variable is injected during build

### No Data in GA Dashboard
1. **Wait 24-48 hours**: GA4 can have delays in reporting
2. **Check Real-time**: Use GA4 real-time reports for immediate feedback
3. **Verify Events**: Check if custom events are configured correctly
4. **Test Production**: Ensure you're testing on the actual deployed site

## Adding Analytics to New Tools

When creating a new tool, add tracking:

```typescript
import { trackToolUsage, trackToolAction, trackCopy, trackClear } from '../../utils/analytics';

// In component
useEffect(() => {
  trackToolUsage('ToolName', 'page_view');
}, []);

// In action handlers
const handleAction = () => {
  // Your tool logic
  trackToolAction('ToolName', 'action_name');
};

const handleCopy = () => {
  // Copy logic
  trackCopy('ToolName');
};
```

## Security Notes

- **Measurement ID is public**: GA measurement IDs are not sensitive
- **No secrets in code**: The actual ID is injected at build time
- **Environment isolation**: Development never sends data to production analytics
- **Domain validation**: Analytics only runs on authorized domains

---

For questions or issues with analytics setup, please open an issue in the repository.
