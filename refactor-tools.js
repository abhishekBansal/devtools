#!/usr/bin/env node

/**
 * Utility script to refactor tool pages to use ToolPageWrapper
 * This script helps convert tool pages from manual useToolTracker calls to ToolPageWrapper
 */

const fs = require('fs');
const path = require('path');

const TOOLS_DIR = '/Users/abhishekbansal/Development/MyStuff/devtools/apps/web/src/pages/tools';

const toolFiles = [
  'JsonPage.tsx',
  'StringAnalyzer.tsx', 
  'StringCaseConverter.tsx',
  'ColorConverter.tsx',
  'XmlFormatter.tsx',
  'CronPage.tsx',
  'HexPage.tsx', 
  'TimestampPage.tsx',
  'UuidPage.tsx'
];

function refactorToolPage(filePath) {
  console.log(`\nRefactoring: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Replace useToolTracker import with ToolPageWrapper import
  content = content.replace(
    /import { useToolTracker } from '\.\.\/\.\.\/hooks\/useToolTracker';?/g,
    "import { ToolPageWrapper } from '../../components/ToolPageWrapper';"
  );
  
  // 2. Remove useToolTracker calls and comments
  content = content.replace(/\s*\/\/ Track tool usage\s*\n\s*useToolTracker\(\);?\s*/g, '');
  
  // 3. Find and replace the return statement structure
  // This is a simplified approach - might need manual adjustment for complex cases
  const returnPattern = /return \(\s*<>\s*/g;
  const spacePattern = /<Space direction="vertical"[^>]*>\s*/g;
  const endSpacePattern = /\s*<\/Space>\s*<\/>\s*\);/g;
  
  if (returnPattern.test(content)) {
    content = content.replace(returnPattern, 'return (\n    <ToolPageWrapper>');
    content = content.replace(spacePattern, '');
    content = content.replace(endSpacePattern, '\n    </ToolPageWrapper>\n  );');
  }
  
  console.log('✅ Basic transformations applied');
  console.log('⚠️  Manual review needed for complex layouts');
  
  // Write the updated content
  fs.writeFileSync(filePath, content);
}

function main() {
  console.log('🔧 Tool Page Refactoring Utility');
  console.log('===================================');
  
  toolFiles.forEach(fileName => {
    const filePath = path.join(TOOLS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      try {
        refactorToolPage(filePath);
      } catch (error) {
        console.error(`❌ Error refactoring ${fileName}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${fileName}`);
    }
  });
  
  console.log('\n✅ Refactoring complete!');
  console.log('🔍 Please review all changes manually');
  console.log('📝 Some files may need manual adjustment for complex layouts');
}

if (require.main === module) {
  main();
}
