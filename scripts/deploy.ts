import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Publishes the production build to the fork's gh-pages branch for
// GitHub Pages hosting (e.g. https://racher.github.io/factoriolab/).
// Run `npm run deploy`, which builds with the "pages" base href first.

const dist = 'dist/factoriolab/browser';

if (!fs.existsSync(path.join(dist, 'index.html')))
  throw new Error(`No build found in ${dist}. Run the build before deploying.`);

// Push to whatever fork is configured as origin in the source repo.
const remote = execSync('git remote get-url origin').toString().trim();

// SPA fallback for deep links, and disable Jekyll so _-prefixed files are served.
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

// The build folder is recreated each build, so a fresh throwaway repo here
// keeps the built artifacts off the source branches entirely.
const run = (cmd: string): void =>
  execSync(cmd, { cwd: dist, stdio: 'inherit' });

run('git init -b gh-pages');
run('git add -A');
run('git commit -m "Deploy FactorioLab"');
run(`git push -f ${remote} gh-pages`);

console.log('\nDeployed to gh-pages. Enable Pages on that branch if you');
console.log('have not already: repo Settings > Pages > Branch: gh-pages.');
