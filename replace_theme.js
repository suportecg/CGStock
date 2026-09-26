const fs = require('fs');
const path = require('path');

const replacements = [
    { pattern: /\bbackdrop-blur-(sm|md|lg|xl)\b/g, replacement: '' },
    { pattern: /\bbg-card\/(40|50|60|80|95)\b/g, replacement: 'bg-card' },
    { pattern: /\bborder-border\/(30|40|50)\b/g, replacement: 'border-border' },
    { pattern: /\brounded-(2xl|3xl|xl|\[2rem\])\b/g, replacement: 'rounded-md' },
    { pattern: /\bshadow-(xl|2xl|lg|md)\b/g, replacement: 'shadow-sm' },
    { pattern: /\bshadow-indigo-[a-zA-Z0-9/-]+\b/g, replacement: '' },
    { pattern: /\bshadow-primary\/[0-9]+\b/g, replacement: '' },
    { pattern: /\btransition-(all|colors|shadow)\b/g, replacement: '' },
    { pattern: /\bduration-(200|300|500)\b/g, replacement: '' },
    { pattern: /\bease-in-out\b/g, replacement: '' },
    { pattern: /\bhover:border-primary(\/[0-9]+)?\b/g, replacement: '' },
    { pattern: /\bhover:bg-primary\/(\[[0-9.]+\]|[0-9]+)\b/g, replacement: 'hover:bg-muted/50' },
    { pattern: /\banimate-pulse\b/g, replacement: '' },
    { pattern: /\banimate-in\b/g, replacement: '' },
    { pattern: /\bfade-in(-[0-9]+)?\b/g, replacement: '' },
    { pattern: /\bzoom-in(-[0-9]+)?\b/g, replacement: '' },
    { pattern: /\bbg-gradient-[a-zA-Z0-9/-]+\b/g, replacement: '' },
    { pattern: /\bfrom-[a-zA-Z0-9/-]+\b/g, replacement: '' },
    { pattern: /\bvia-[a-zA-Z0-9/-]+\b/g, replacement: '' },
    { pattern: /\bto-[a-zA-Z0-9/-]+\b/g, replacement: '' },
    { pattern: /\bhover:shadow-md\b/g, replacement: '' },
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
