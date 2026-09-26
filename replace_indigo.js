const fs = require('fs');
const path = require('path');

const replacements = [
    { pattern: /\bbg-indigo-(500|600|700)\b/g, replacement: 'bg-primary' },
    { pattern: /\btext-indigo-(500|600|700)\b/g, replacement: 'text-primary' },
    { pattern: /\bhover:bg-indigo-(600|700)\b/g, replacement: 'hover:bg-primary/90' },
    { pattern: /\bhover:text-indigo-(600|700)\b/g, replacement: 'hover:text-primary/90' },
    { pattern: /\bborder-indigo-(500|600|700)\b/g, replacement: 'border-primary' },
    { pattern: /\bring-indigo-(500|600|700)(\/[0-9]+)?\b/g, replacement: 'ring-primary' },
    { pattern: /\bshadow-indigo-(500|600)(\/[0-9]+)?\b/g, replacement: 'shadow-primary/10' },
    
    // Light shades
    { pattern: /\bbg-indigo-50\b/g, replacement: 'bg-primary/5' },
    { pattern: /\bbg-indigo-100\b/g, replacement: 'bg-primary/10' },
    { pattern: /\bbg-indigo-200\b/g, replacement: 'bg-primary/20' },
    
    { pattern: /\btext-indigo-50\b/g, replacement: 'text-primary-foreground' },
    { pattern: /\btext-indigo-100\b/g, replacement: 'text-primary-foreground/90' },
    { pattern: /\btext-indigo-200\b/g, replacement: 'text-primary-foreground/80' },
    
    { pattern: /\bborder-indigo-100\b/g, replacement: 'border-primary/10' },
    { pattern: /\bborder-indigo-200\b/g, replacement: 'border-primary/20' },
    { pattern: /\bborder-indigo-300\b/g, replacement: 'border-primary/30' },
    
    // Dark shades
    { pattern: /\btext-indigo-900\b/g, replacement: 'text-primary-foreground' },
    { pattern: /\bbg-indigo-900\b/g, replacement: 'bg-primary' },
    
    // Fallback for any other indigo
    { pattern: /\b([a-z]+)-indigo-[0-9]+\b/g, replacement: '$1-primary' }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    replacements.forEach(({ pattern, replacement }) => {
        newContent = newContent.replace(pattern, replacement);
    });

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    });
}

walkDir('./src');
