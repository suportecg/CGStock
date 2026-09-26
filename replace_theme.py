import os
import re

replacements = {
    r'\bbackdrop-blur-(sm|md|lg|xl)\b': '',
    r'\bbg-card/(40|50|60|80|95)\b': 'bg-card',
    r'\bborder-border/(30|40|50)\b': 'border-border',
    r'\brounded-(2xl|3xl|xl|\[2rem\])\b': 'rounded-md',
    r'\bshadow-(xl|2xl|lg|md)\b': 'shadow-sm',
    r'\bshadow-indigo-500/[0-9]+\b': '',
    r'\bshadow-primary/[0-9]+\b': '',
    r'\btransition-(all|colors|shadow)\b': '',
    r'\bduration-(200|300|500)\b': '',
    r'\bease-in-out\b': '',
    r'\bhover:border-primary(/[0-9]+)?\b': '',
    r'\bhover:bg-primary/\[[0-9.]+\]\b': 'hover:bg-muted/50',
    r'\bhover:bg-primary/[0-9]+\b': 'hover:bg-muted/50',
    r'\banimate-pulse\b': '',
    r'\banimate-in\b': '',
    r'\bfade-in(-[0-9]+)?\b': '',
    r'\bzoom-in(-[0-9]+)?\b': '',
    r'\bbg-gradient-to-[a-z]+\b': '',
    r'\bfrom-[a-z]+-[0-9]+(/[0-9]+)?\b': '',
    r'\bvia-[a-z]+\b': '',
    r'\bto-[a-z]+\b': '',
    r'\bhover:shadow-md\b': '',
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

