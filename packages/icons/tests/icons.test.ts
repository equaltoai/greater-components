import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('@equaltoai/greater-components-icons', () => {
  let builtIcons: string[] = [];
  let srcIconList: string[] = [];
  let hasDistBuilt = false;
  const srcAliases: Record<string, string> = {};
  const srcCategories: Record<string, string[]> = {};

  beforeAll(async () => {
    // Check that icons were built
    const distPath = path.join(__dirname, '../dist');
    const srcIconsPath = path.join(__dirname, '../src/icons');
    const srcIndexPath = path.join(__dirname, '../src/index.ts');
    
    hasDistBuilt = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.js'));
    
    if (fs.existsSync(srcIconsPath)) {
      builtIcons = fs.readdirSync(srcIconsPath).filter(file => file.endsWith('.svelte'));
    }

    // Read the source index file to get expected data structures
    if (fs.existsSync(srcIndexPath)) {
      const indexContent = fs.readFileSync(srcIndexPath, 'utf8');
      
      // Extract icon exports
      const exportMatches = indexContent.match(/export \{ default as (\w+)Icon \}/g);
      if (exportMatches) {
        srcIconList = exportMatches.map(match => 
          match.replace(/export \{ default as (\w+)Icon \}/, '$1').toLowerCase()
        );
      }

      // Extract aliases
      const aliasMatch = indexContent.match(/export const iconAliases: Record<string, IconName> = \{([^}]+)\}/s);
      if (aliasMatch) {
        try {
          const aliasesText = aliasMatch[1];
          const aliasLines = aliasesText.split('\n').filter(line => line.includes(':'));
          aliasLines.forEach(line => {
            const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
            if (match) {
              srcAliases[match[1]] = match[2];
            }
          });
        } catch (e) {
          console.warn('Could not parse aliases:', e);
        }
      }

      // Extract categories
      const categoriesMatch = indexContent.match(/export const iconCategories = \{([^}]+)\}/s);
      if (categoriesMatch) {
        try {
          const categoriesText = categoriesMatch[1];
          const categoryMatches = categoriesText.match(/(\w+): \[([^\]]+)\]/g);
          if (categoryMatches) {
            categoryMatches.forEach(match => {
              const [, name, items] = match.match(/(\w+): \[([^\]]+)\]/) || [];
              if (name && items) {
                srcCategories[name] = items.split(',').map(item => 
                  item.trim().replace(/['"]/g, '')
                );
              }
            });
          }
        } catch (e) {
          console.warn('Could not parse categories:', e);
        }
      }
    }
  });

  describe('Build Verification', () => {
    it('should have built icon files', () => {
      expect(builtIcons.length).toBeGreaterThan(200);
      expect(builtIcons.includes('home.svelte')).toBe(true);
      expect(builtIcons.includes('search.svelte')).toBe(true);
      expect(builtIcons.includes('boost.svelte')).toBe(true);
      expect(builtIcons.includes('favorite.svelte')).toBe(true);
    });

    it.skipIf(!hasDistBuilt)('should have built dist directory', () => {
      const distPath = path.join(__dirname, '../dist');
      expect(fs.existsSync(distPath)).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'index.js'))).toBe(true);
    });

    it('should have proper source structure', () => {
      const srcPath = path.join(__dirname, '../src');
      const iconsPath = path.join(srcPath, 'icons');
      const indexPath = path.join(srcPath, 'index.ts');
      
      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(iconsPath)).toBe(true);
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });

  describe('Source Code Analysis', () => {
    it('should have comprehensive icon exports in source', () => {
      expect(srcIconList.length).toBeGreaterThan(200);
      expect(srcIconList.includes('home')).toBe(true);
      expect(srcIconList.includes('search')).toBe(true);
      expect(srcIconList.includes('user')).toBe(true);
      expect(srcIconList.includes('menu')).toBe(true);
      expect(srcIconList.includes('settings')).toBe(true);
      
      // Test fediverse icons
      expect(srcIconList.includes('boost')).toBe(true);
      expect(srcIconList.includes('favorite')).toBe(true);
      expect(srcIconList.includes('follow')).toBe(true);
    });

    it('should have proper icon categorization in source', () => {
      if (Object.keys(srcCategories).length > 0) {
        expect(srcCategories.fediverse).toContain('boost');
        expect(srcCategories.fediverse).toContain('unboost');
        expect(srcCategories.fediverse).toContain('favorite');
        expect(srcCategories.fediverse).toContain('unfavorite');
        
        expect(srcCategories.navigation).toContain('home');
        expect(srcCategories.navigation).toContain('arrow-left');
        expect(srcCategories.navigation).toContain('arrow-right');
        
        expect(srcCategories.user).toContain('user');
        expect(srcCategories.user).toContain('users');
        
        expect(srcCategories.ui).toContain('menu');
        expect(srcCategories.ui).toContain('search');
        expect(srcCategories.ui).toContain('settings');
      }
    });

    it('should have comprehensive aliases in source', () => {
      if (Object.keys(srcAliases).length > 0) {
        expect(srcAliases.world).toBe('globe');
        expect(srcAliases.public).toBe('globe');
        expect(srcAliases.private).toBe('lock');
        expect(srcAliases.unlisted).toBe('eye-off');
        expect(srcAliases.direct).toBe('mail');
        expect(srcAliases.message).toBe('message-circle');
        expect(srcAliases.repost).toBe('boost');
        expect(srcAliases.reblog).toBe('boost');
        expect(srcAliases.like).toBe('favorite');
        expect(srcAliases.heart).toBe('favorite');
        expect(srcAliases.close).toBe('x');
      }
    });

    it('should have fediverse-specific aliases in source', () => {
      if (Object.keys(srcAliases).length > 0) {
        expect(srcAliases.repost).toBe('boost');
        expect(srcAliases.reblog).toBe('boost');
        expect(srcAliases.like).toBe('favorite');
        expect(srcAliases.heart).toBe('favorite');
      }
    });

    it('should map all aliases to valid icon names in source', () => {
      if (Object.keys(srcAliases).length > 0 && srcIconList.length > 0) {
        Object.entries(srcAliases).forEach(([alias, iconName]) => {
          const normalizedIconName = iconName.toLowerCase();
          // Some icons might have hyphens that need to be handled
          const hasIcon = srcIconList.includes(normalizedIconName) || 
                         srcIconList.some(name => name.replace(/-/g, '') === normalizedIconName.replace(/-/g, ''));
          
          if (!hasIcon) {
            console.warn(`Alias "${alias}" -> "${iconName}" not found in icon list. Available similar: ${
              srcIconList.filter(name => name.includes(normalizedIconName.split('-')[0])).slice(0, 3).join(', ')
            }`);
          }
          expect(hasIcon).toBe(true);
        });
      }
    });
  });

  describe('Individual Icon Files', () => {
    it('should have individual icon files', () => {
      const iconsPath = path.join(__dirname, '../src/icons');
      
      if (fs.existsSync(iconsPath)) {
        const iconFiles = fs.readdirSync(iconsPath).filter(file => file.endsWith('.svelte'));
        
        expect(iconFiles.length).toBeGreaterThan(200);
        expect(iconFiles.includes('home.svelte')).toBe(true);
        expect(iconFiles.includes('search.svelte')).toBe(true);
        expect(iconFiles.includes('boost.svelte')).toBe(true);
        expect(iconFiles.includes('favorite.svelte')).toBe(true);
      }
    });

    it('should have consistent Svelte component structure', () => {
      const homePath = path.join(__dirname, '../src/icons/home.svelte');
      
      if (fs.existsSync(homePath)) {
        const content = fs.readFileSync(homePath, 'utf8');
        
        expect(content).toContain('<script lang="ts">');
        expect(content).toContain('interface Props');
        expect(content).toContain('size?: number | string');
        expect(content).toContain('color?: string');
        expect(content).toContain('strokeWidth?: number | string');
        expect(content).toContain('<svg');
        expect(content).toContain('class="gr-icon gr-icon-home');
      }
    });

    it('should have proper accessibility attributes', () => {
      const homePath = path.join(__dirname, '../src/icons/home.svelte');
      
      if (fs.existsSync(homePath)) {
        const content = fs.readFileSync(homePath, 'utf8');
        
        expect(content).toContain('aria-hidden="true"');
        expect(content).toContain('aria-label=');
        expect(content).toContain('aria-labelledby=');
        expect(content).toContain('aria-describedby=');
        expect(content).toContain('role');
      }
    });
  });

  describe('Package Configuration', () => {
    it('should have package.json with correct configuration', () => {
      const packagePath = path.join(__dirname, '../package.json');
      
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        expect(packageJson.name).toBe('@equaltoai/greater-components-icons');
        expect(packageJson.main).toBe('./dist/index.js');
        expect(packageJson.module).toBe('./dist/index.js');
        expect(packageJson.types).toBe('./dist/index.d.ts');
        expect(packageJson.scripts.test).toBeDefined();
        expect(packageJson.scripts.build).toBeDefined();
        expect(packageJson.scripts['test:coverage']).toBeDefined();
      }
    });

    it('should have proper TypeScript configuration', () => {
      const tsconfigPath = path.join(__dirname, '../tsconfig.json');
      
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        
        expect(tsconfig.compilerOptions).toBeDefined();
        expect(tsconfig.include).toBeDefined();
      }
    });

    it('should have proper Vite configuration', () => {
      const vitePath = path.join(__dirname, '../vite.config.ts');
      const viteConfigPath = path.join(__dirname, '../vitest.config.ts');
      
      expect(
        fs.existsSync(vitePath) || fs.existsSync(viteConfigPath)
      ).toBe(true);
    });
  });

  describe('Build Output Validation', () => {
    it.skipIf(!hasDistBuilt)('should have generated build artifacts', () => {
      const distPath = path.join(__dirname, '../dist');
      const indexPath = path.join(distPath, 'index.js');
      
      expect(fs.existsSync(indexPath)).toBe(true);
      
      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content.length).toBeGreaterThan(1000); // Should be substantial
    });

    it.skipIf(!hasDistBuilt)('should be importable as ES module', async () => {
      try {
        // Use new URL() to construct a dynamic import path that Vite won't statically analyze
        const distPath = path.resolve(__dirname, '../dist/index.js');
        const moduleUrl = new URL(`file://${distPath}`).href;
        // @ts-expect-error - Dynamic import path constructed at runtime
        const module = await import(/* @vite-ignore */ moduleUrl);
        expect(typeof module).toBe('object');
        expect(Object.keys(module).length).toBeGreaterThan(0);
      } catch (error) {
        console.warn('Module import failed:', error);
        throw error;
      }
    });
  });

  describe('Source-Build Consistency', () => {
    it('should have consistent number of icons between source and build', () => {
      const sourceIconCount = builtIcons.length;
      const indexIconCount = srcIconList.length;
      
      if (sourceIconCount > 0 && indexIconCount > 0) {
        // Allow for small differences due to build process
        expect(Math.abs(sourceIconCount - indexIconCount)).toBeLessThan(5);
      }
    });

    it('should include all essential fediverse icons', () => {
      const essentialIcons = ['boost', 'favorite', 'follow', 'reply', 'hashtag', 'mention'];
      
      essentialIcons.forEach(icon => {
        expect(builtIcons.includes(`${icon}.svelte`)).toBe(true);
        if (srcIconList.length > 0) {
          expect(srcIconList.includes(icon)).toBe(true);
        }
      });
    });

    it('should include all essential UI icons', () => {
      const essentialIcons = ['home', 'search', 'menu', 'settings', 'user', 'bell', 'mail'];
      
      essentialIcons.forEach(icon => {
        expect(builtIcons.includes(`${icon}.svelte`)).toBe(true);
        if (srcIconList.length > 0) {
          expect(srcIconList.includes(icon)).toBe(true);
        }
      });
    });
  });
});