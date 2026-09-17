const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/actions.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('revalidatePath')) {
    // Insert import at the top
    content = content.replace('"use server"', '"use server"\n\nimport { revalidatePath } from "next/cache"');
  }

  // Replace redirect(...) with revalidatePath('/', 'layout'); redirect(...)
  // Need to be careful to only replace redirect when it's not already preceded by revalidatePath
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('redirect(') && !lines[i].includes('error=')) { // Don't revalidate on error redirects
      // check if previous line has revalidatePath
      if (i > 0 && !lines[i-1].includes('revalidatePath')) {
        // if it's a return redirect(...)
        if (lines[i].includes('return redirect')) {
          lines[i] = lines[i].replace('return redirect', 'revalidatePath("/", "layout");\n    return redirect');
        } else {
          // just redirect(...)
          lines[i] = lines[i].replace('redirect(', 'revalidatePath("/", "layout");\n  redirect(');
        }
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
}
console.log('Fixed cache invalidation in actions.');
