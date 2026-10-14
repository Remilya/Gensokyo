import { execSync } from 'node:child_process';
import { writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
if (!existsSync(distDir)) {
  console.error('Error: dist/ directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Create .nojekyll to bypass Jekyll processing on GitHub Pages
writeFileSync(join(distDir, '.nojekyll'), '');

// Clean any existing .git inside dist
const distGit = join(distDir, '.git');
if (existsSync(distGit)) {
  rmSync(distGit, { recursive: true, force: true });
}

const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();

console.log(`Deploying dist/ to ${remoteUrl} (gh-pages branch)...`);
execSync('git init', { cwd: distDir, stdio: 'inherit' });
execSync('git checkout -b gh-pages', { cwd: distDir, stdio: 'inherit' });
execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
execSync('git commit -m "Deploy Gensokyo Interactive Atlas to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
execSync(`git push -f "${remoteUrl}" gh-pages`, { cwd: distDir, stdio: 'inherit' });

rmSync(distGit, { recursive: true, force: true });
console.log('Successfully deployed to gh-pages!');
