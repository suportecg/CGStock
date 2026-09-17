import os
import re

replacements = {
    r'\bbg-white\b': 'bg-card',
    r'\bbg-gray-50\b': 'bg-muted',
    r'\bbg-gray-100\b': 'bg-accent',
    r'\bborder-gray-200\b': 'border-border',
    r'\btext-gray-950\b': 'text-foreground',
    r'\btext-gray-900\b': 'text-foreground',
    r'\btext-gray-500\b': 'text-muted-foreground',
    r'\btext-gray-600\b': 'text-muted-foreground',
    r'\btext-gray-400\b': 'text-muted-foreground',
    r'\bhover:bg-gray-100\b': 'hover:bg-accent hover:text-accent-foreground',
    r'\bhover:bg-gray-50/50\b': 'hover:bg-muted/50',
    r'\bdata-\[state=selected\]:bg-gray-50\b': 'data-[state=selected]:bg-muted',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

