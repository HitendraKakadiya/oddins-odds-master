const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('page.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('apps/frontend/src/app/academy');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already processed
  if (!content.includes('use client')) {
    continue;
  }

  // 1. Remove 'use client'
  content = content.replace(/'use client';\r?\n+/, '');
  content = content.replace(/"use client";\r?\n+/, '');

  // 2. Add StrategyPageClientWrapper import
  if (!content.includes('StrategyPageClientWrapper')) {
    content = content.replace(
      /import StrategyContentSection from '@\/components\/Academy\/StrategyContentSection';/,
      "import StrategyContentSection from '@/components/Academy/StrategyContentSection';\nimport StrategyPageClientWrapper from '@/components/Academy/StrategyPageClientWrapper';"
    );
  }

  // 3. Remove StrategyTOC and TodaysMatchesWidget imports
  content = content.replace(/import StrategyTOC from '@\/components\/Academy\/StrategyTOC';\r?\n?/, '');
  content = content.replace(/import TodaysMatchesWidget from '@\/components\/About\/TodaysMatchesWidget';\r?\n?/, '');

  // 4. Remove useState and useEffect imports
  content = content.replace(/import \{(.+)?useState(.+)?\} from 'react';\r?\n?/, (match) => {
    // If it only imports useState and useEffect, remove the whole line
    if (match.includes('useEffect') && match.replace(/import|from|'react'|;|\{|\}|useState|useEffect|,|\s/g, '').length === 0) {
      return '';
    }
    return match.replace(/useState,?\s?/, '').replace(/useEffect,?\s?/, '');
  });

  // 5. Remove states
  content = content.replace(/const \[(?:activeSection|scrollProgress)[^;]+;\r?\n/g, '');

  // 6. Remove useEffects
  content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[.*?\]\);\r?\n/g, '');

  // 7. Remove scrollProgress div
  const scrollDivRegex = /<div className="fixed top-0 left-0 w-full h-1\.5 z-50 bg-slate-100">[\s\S]*?<\/div>\r?\n\s*/;
  content = content.replace(scrollDivRegex, '');

  // 8. Replace layout start with StrategyPageClientWrapper
  const layoutStartRegex = /<div className="flex flex-col lg:flex-row gap-12(?:\s+.*?)?">\s*<main className="flex-1 min-w-0 order-2 lg:order-1">/;
  content = content.replace(layoutStartRegex, '<StrategyPageClientWrapper sections={sections.map(s => ({id: s.id, title: s.title}))}>');

  // 9. Replace layout end (</main> <aside>...</aside> </div>)
  const layoutEndRegex = /<\/main>\s*<aside className="w-full lg:w-\[380px\] space-y-8 order-1 lg:order-2">[\s\S]*?<\/aside>\s*<\/div>/;
  content = content.replace(layoutEndRegex, '</StrategyPageClientWrapper>');

  // 10. Remove isActive prop
  content = content.replace(/isActive=\{activeSection === [^}]+\}/g, '');

  fs.writeFileSync(file, content, 'utf8');
  changedCount++;
  console.log(`Updated ${file}`);
}

console.log(`\nSuccessfully converted ${changedCount} files to Server Components.`);
