import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import {defineConfig, Plugin} from 'vite';

function saveImageToDisk(key: string, dataUrl: string) {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid dataUrl format');
  }

  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';

  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `uploaded_${safeKey}.${ext}`;

  const uploadsDir = path.resolve(__dirname, 'public/images/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 1. Delete any existing predecessor image files for this key (e.g. previous .png, .jpg, .webp)
  try {
    const existingUploads = fs.readdirSync(uploadsDir);
    for (const f of existingUploads) {
      if ((f.startsWith(`uploaded_${safeKey}.`) && f !== filename) ||
          (safeKey === 'product_hpmc' && f.startsWith('uploaded_product_top-cell-hpmc.')) ||
          (safeKey === 'product_styrene-acrylic' && (f.startsWith('uploaded_product_vam-acrylic.') || f.startsWith('uploaded_product_vam-veova-acrylic.'))) ||
          (safeKey === 'product_xylene' && f.startsWith('uploaded_product_xylene-toluene.'))) {
        fs.unlinkSync(path.join(uploadsDir, f));
        console.log(`[Image Persistence] Deleted predecessor image: ${f}`);
      }
    }
  } catch {}

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);

  // If hero image, also save directly as public/images/kemizone-hero-fleet.jpg & .png
  if (key === 'home_hero_cars' || key === 'kemizone_cars_image') {
    const heroDir = path.resolve(__dirname, 'public/images');
    if (!fs.existsSync(heroDir)) {
      fs.mkdirSync(heroDir, { recursive: true });
    }
    fs.writeFileSync(path.resolve(heroDir, `kemizone-hero-fleet.${ext}`), buffer);
    fs.writeFileSync(path.resolve(heroDir, 'kemizone-hero-fleet.jpg'), buffer);
    fs.writeFileSync(path.resolve(heroDir, 'kemizone-hero-fleet.png'), buffer);
  }

  // Also sync to dist if dist exists
  const distUploadsDir = path.resolve(__dirname, 'dist/images/uploads');
  if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
    if (!fs.existsSync(distUploadsDir)) {
      fs.mkdirSync(distUploadsDir, { recursive: true });
    }
    // Delete predecessor from dist as well
    try {
      const existingDist = fs.readdirSync(distUploadsDir);
      for (const f of existingDist) {
        if ((f.startsWith(`uploaded_${safeKey}.`) && f !== filename) ||
            (safeKey === 'product_hpmc' && f.startsWith('uploaded_product_top-cell-hpmc.')) ||
            (safeKey === 'product_styrene-acrylic' && (f.startsWith('uploaded_product_vam-acrylic.') || f.startsWith('uploaded_product_vam-veova-acrylic.'))) ||
            (safeKey === 'product_xylene' && f.startsWith('uploaded_product_xylene-toluene.'))) {
          fs.unlinkSync(path.join(distUploadsDir, f));
        }
      }
    } catch {}

    fs.writeFileSync(path.join(distUploadsDir, filename), buffer);
    if (key === 'home_hero_cars' || key === 'kemizone_cars_image') {
      const distImages = path.resolve(__dirname, 'dist/images');
      if (!fs.existsSync(distImages)) {
        fs.mkdirSync(distImages, { recursive: true });
      }
      fs.writeFileSync(path.resolve(distImages, `kemizone-hero-fleet.${ext}`), buffer);
      fs.writeFileSync(path.resolve(distImages, 'kemizone-hero-fleet.jpg'), buffer);
      fs.writeFileSync(path.resolve(distImages, 'kemizone-hero-fleet.png'), buffer);
    }
  }

  const publicPath = (key === 'home_hero_cars' || key === 'kemizone_cars_image')
    ? `/images/kemizone-hero-fleet.jpg`
    : `/images/uploads/${filename}`;

  // Update src/data/persistedImages.ts
  try {
    const registryPath = path.resolve(__dirname, 'src/data/persistedImages.ts');
    let currentMap: Record<string, string> = {};
    if (fs.existsSync(registryPath)) {
      const content = fs.readFileSync(registryPath, 'utf8');
      const jsonMatch = content.match(/export const persistedImages: Record<string, string> = ([\s\S]*?);/);
      if (jsonMatch) {
        try {
          currentMap = JSON.parse(jsonMatch[1]);
        } catch {
          // ignore
        }
      }
    }
    currentMap[key] = publicPath;
    if (key === 'home_hero_cars' || key === 'kemizone_cars_image') {
      currentMap['home_hero_cars'] = `/images/kemizone-hero-fleet.jpg`;
      currentMap['kemizone_cars_image'] = `/images/kemizone-hero-fleet.jpg`;
    }

    const newContent = `// Persisted Images Registry\n// Maps imageKey to permanently stored static image file in ./images/\nexport const persistedImages: Record<string, string> = ${JSON.stringify(currentMap, null, 2)};\n`;
    fs.writeFileSync(registryPath, newContent, 'utf8');

    // If it's a product image, also update src/data/customProducts.json immediately
    if (key.startsWith('product_')) {
      const prodId = key.replace('product_', '');
      const customProductsPath = path.resolve(__dirname, 'src/data/customProducts.json');
      if (fs.existsSync(customProductsPath)) {
        try {
          const prods = JSON.parse(fs.readFileSync(customProductsPath, 'utf8'));
          if (Array.isArray(prods)) {
            let found = false;
            for (const p of prods) {
              if (p.id === prodId || (prodId === 'top-cell-hpmc' && p.id === 'hpmc') || (prodId === 'xylene-toluene' && p.id === 'xylene') || (prodId === 'vam-acrylic' && p.id === 'styrene-acrylic')) {
                p.imageUrl = publicPath;
                found = true;
              }
            }
            if (found) {
              fs.writeFileSync(customProductsPath, JSON.stringify(prods, null, 2), 'utf8');
            }
          }
        } catch (e) {
          console.warn('Failed to update customProducts.json with new image', e);
        }
      }
    }
  } catch (err) {
    console.error('Failed to update persistedImages.ts', err);
  }

  try {
    fs.writeFileSync('/tmp/hero_sync.log', `[${new Date().toISOString()}] Synced key: ${key}, size: ${buffer.length} bytes\n`);
  } catch {}

  return { filename, publicPath };
}

const ORDERED_PRODUCT_IDS = [
  'hpmc', 'hec', 'mhec', 'hemc', 'bentonite', 'rdp', 'ester-alcohol',
  'iron-oxide', 'organic-pigments', 'inorganic-pigment', 'titanium', 'calcined-kaolin',
  'anti-foams', 'dispersing-agent', 'shmp', 'smbs', 'anti-skin', 'zinc-dust',
  'zinc-phosphate', 'fumed-silica', 'zinc-stearate', 'carbon-black', 'dblo',
  'barium-sulfate', 'styrene-acrylic', 'copolymer-emulsion', 'homo-polymer',
  'ipa', 'xylene', 'butyl-acetate', 'ethanol', 'methanol', 'ethyl-acetate',
  'white-spirit', 'talc', 'mica', 'citric-acid'
];

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[^a-z0-9\u0600-\u06FF]/g, ' ')
    .trim();
}

function matchFilenameToProductId(filename: string): string | null {
  const cleanName = filename.toLowerCase();
  const normalized = normalizeText(filename);

  // 1. Direct ID match
  for (const id of ORDERED_PRODUCT_IDS) {
    if (cleanName.includes(id)) return id;
  }

  // 2. Check numbered prefix (01..37)
  const numberMatch = filename.match(/(?:^|[^0-9])([0-3]?[0-9])(?:[^0-9]|$)/);
  if (numberMatch) {
    const num = parseInt(numberMatch[1], 10);
    if (num >= 1 && num <= ORDERED_PRODUCT_IDS.length) {
      if (filename.startsWith(String(num)) || filename.startsWith(num < 10 ? `0${num}` : String(num))) {
        return ORDERED_PRODUCT_IDS[num - 1];
      }
    }
  }

  // 3. Cellulose family
  if (cleanName.includes('hpmc') || normalized.includes('هيدروكسي بروبيل')) return 'hpmc';
  if (cleanName.includes('mhec') || normalized.includes('ميثيل هيدروكسي')) return 'mhec';
  if (cleanName.includes('hemc') || normalized.includes('هيدروكسي ايثيل ميثيل')) return 'hemc';
  if (cleanName.includes('hec') || normalized.includes('هيدروكسي ايثيل')) return 'hec';

  // 4. Minerals & Clays
  if (cleanName.includes('bento') || normalized.includes('بنتونايت') || normalized.includes('بنتونيت')) return 'bentonite';
  if (cleanName.includes('calcined') || cleanName.includes('kaolin') || normalized.includes('كاولين')) return 'calcined-kaolin';
  if (cleanName.includes('talc') || normalized.includes('تلك') || normalized.includes('التلك')) return 'talc';
  if (cleanName.includes('mica') || normalized.includes('ميكا') || normalized.includes('الميكا')) return 'mica';
  if (cleanName.includes('fumed') || cleanName.includes('silica') || cleanName.includes('aerosil') || normalized.includes('فيومد') || normalized.includes('سيليكا')) return 'fumed-silica';
  if (cleanName.includes('bari') || normalized.includes('باريوم') || normalized.includes('سلفات')) return 'barium-sulfate';

  // 5. Polymers & Resins
  if (cleanName.includes('rdp') || normalized.includes('ردي بي') || (normalized.includes('بوليمر') && normalized.includes('بودره'))) return 'rdp';
  if (cleanName.includes('styrene') || cleanName.includes('acrylic') || normalized.includes('ستيرين') || normalized.includes('اكريليك')) return 'styrene-acrylic';
  if (cleanName.includes('copolymer') || normalized.includes('كوبوليمر')) return 'copolymer-emulsion';
  if (cleanName.includes('homo') || cleanName.includes('pva') || normalized.includes('هوموبوليمر') || normalized.includes('هومو')) return 'homo-polymer';

  // 6. Pigments
  if (cleanName.includes('titanium') || normalized.includes('تيتانيوم') || normalized.includes('روتيل')) return 'titanium';
  if (cleanName.includes('carbon') || cleanName.includes('black') || normalized.includes('كربون') || normalized.includes('اسود الكربون')) return 'carbon-black';
  if (cleanName.includes('iron') || cleanName.includes('oxide') || normalized.includes('اكسيد الحديد') || normalized.includes('حديد')) return 'iron-oxide';
  if (cleanName.includes('inorganic') || cleanName.includes('inorgan') || normalized.includes('غير عضويه')) return 'inorganic-pigment';
  if (cleanName.includes('organic') || normalized.includes('عضويه') || normalized.includes('اصباغ')) return 'organic-pigments';

  // 7. Zinc compounds
  if (cleanName.includes('zincdust') || (cleanName.includes('zinc') && cleanName.includes('dust')) || normalized.includes('غبار الزنك') || normalized.includes('مسحوق الزنك')) return 'zinc-dust';
  if (cleanName.includes('zincphos') || (cleanName.includes('zinc') && cleanName.includes('phos')) || normalized.includes('فوسفات الزنك')) return 'zinc-phosphate';
  if (cleanName.includes('zincstear') || (cleanName.includes('zinc') && cleanName.includes('stear')) || normalized.includes('ستيارات الزنك') || normalized.includes('ستيرات الزنك')) return 'zinc-stearate';

  // 8. Solvents
  if (cleanName.includes('butyl') || normalized.includes('بيوتيل')) return 'butyl-acetate';
  if (cleanName.includes('ethyl') || normalized.includes('ايثيل اسيتات')) return 'ethyl-acetate';
  if (cleanName.includes('whitespirit') || cleanName.includes('mineral spirit') || normalized.includes('وايت سبيريت') || normalized.includes('وايت سبيرت') || normalized.includes('كيروسين')) return 'white-spirit';
  if (cleanName.includes('xylene') || normalized.includes('زايلين') || normalized.includes('زيلين')) return 'xylene';
  if (cleanName.includes('methanol') || normalized.includes('ميثانول')) return 'methanol';
  if (cleanName.includes('ethanol') || normalized.includes('ايثانول')) return 'ethanol';
  if (cleanName.includes('ipa') || cleanName.includes('isoprop') || normalized.includes('ايزوبروبيل') || normalized.includes('ايزو بروبيل')) return 'ipa';

  // 9. Additives & Special chemicals
  if (cleanName.includes('antifoam') || cleanName.includes('defoamer') || normalized.includes('مانع رغوه') || normalized.includes('مضاد رغوه') || normalized.includes('رغوه')) return 'anti-foams';
  if (cleanName.includes('dispers') || normalized.includes('تشتيت') || normalized.includes('مشتت')) return 'dispersing-agent';
  if (cleanName.includes('ester') || cleanName.includes('texanol') || normalized.includes('استر') || normalized.includes('تكسانول')) return 'ester-alcohol';
  if (cleanName.includes('shmp') || normalized.includes('ميتافوسفات')) return 'shmp';
  if (cleanName.includes('smbs') || normalized.includes('ميتابيسلفيت')) return 'smbs';
  if (cleanName.includes('antiskin') || cleanName.includes('meko') || normalized.includes('مانع قشره') || normalized.includes('قشره')) return 'anti-skin';
  if (cleanName.includes('dblo') || cleanName.includes('linseed') || normalized.includes('بذره الكتان') || normalized.includes('بذر الكتان') || normalized.includes('كتان')) return 'dblo';
  if (cleanName.includes('citric') || normalized.includes('ستريك') || normalized.includes('ليمون')) return 'citric-acid';

  return null;
}

function imagePersistencePlugin(): Plugin {
  return {
    name: 'vite-image-persistence-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/sync-hero-status' && req.method === 'GET') {
          const heroPath = path.resolve(__dirname, 'public/images/kemizone-hero-fleet.jpg');
          const exists = fs.existsSync(heroPath);
          const size = exists ? fs.statSync(heroPath).size : 0;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ exists, size, path: '/images/kemizone-hero-fleet.jpg' }));
          return;
        }

        if (req.url === '/api/sync-hero-image' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { dataUrl } = JSON.parse(body || '{}');
              if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image')) {
                const resHero = saveImageToDisk('home_hero_cars', dataUrl);
                saveImageToDisk('kemizone_cars_image', dataUrl);

                // Auto package zips and dist in background so downloads and builds are immediately up to date
                const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');
                exec(`python3 "${scriptPath}" --type=all`, (err) => {
                  if (err) console.warn('[Auto Package] Error:', err);
                  else console.log('[Auto Package] Packages updated with hero image!');
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, path: resHero.publicPath }));
                return;
              }
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing or invalid dataUrl' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/save-image' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { key, dataUrl } = JSON.parse(body);
              if (!key || !dataUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing key or dataUrl' }));
                return;
              }
              const result = saveImageToDisk(key, dataUrl);

              // Auto package downloads in background
              const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');
              exec(`python3 "${scriptPath}" --type=all`, (err) => {
                if (err) console.warn('[Auto Package] Error:', err);
                else console.log('[Auto Package] Packages updated with saved image!');
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, ...result }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/sync-images' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { images } = JSON.parse(body);
              const saved: Record<string, string> = {};
              if (images && typeof images === 'object') {
                for (const [key, val] of Object.entries(images)) {
                  if (typeof val === 'string') {
                    if (val.startsWith('data:image')) {
                      const result = saveImageToDisk(key, val);
                      saved[key] = result.publicPath;
                    } else if (val.startsWith('[') && val.includes('"id"')) {
                      try {
                        const parsedList = JSON.parse(val);
                        if (Array.isArray(parsedList)) {
                          for (const item of parsedList) {
                            if (item.id && item.imageUrl && item.imageUrl.startsWith('data:image')) {
                              const result = saveImageToDisk(`product_${item.id}`, item.imageUrl);
                              saved[`product_${item.id}`] = result.publicPath;
                            }
                          }
                        }
                      } catch {}
                    }
                  }
                }
              }

              if (Object.keys(saved).length > 0) {
                const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');
                exec(`python3 "${scriptPath}" --type=all`, (err) => {
                  if (err) console.warn('[Auto Package] Error:', err);
                  else console.log('[Auto Package] Packages updated with newly synced images!');
                });
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: Object.keys(saved).length, saved }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/batch-upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { files } = JSON.parse(body || '{}');
              const saved: Record<string, string> = {};
              if (Array.isArray(files)) {
                for (const item of files) {
                  if (item && item.name && item.dataUrl && typeof item.dataUrl === 'string' && item.dataUrl.startsWith('data:image')) {
                    const productId = item.productId || matchFilenameToProductId(item.name);
                    if (productId) {
                      const result = saveImageToDisk(`product_${productId}`, item.dataUrl);
                      saved[productId] = result.publicPath;
                    }
                  }
                }
              }

              if (Object.keys(saved).length > 0) {
                const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');
                exec(`python3 "${scriptPath}" --type=all`, (err) => {
                  if (err) console.warn('[Auto Package] Error:', err);
                  else console.log('[Auto Package] Packages updated with batch-uploaded images!');
                });
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: Object.keys(saved).length, saved }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/sync-products' || req.url === '/api/products') {
          if (req.method === 'GET') {
            try {
              const customProductsPath = path.resolve(__dirname, 'src/data/customProducts.json');
              if (fs.existsSync(customProductsPath)) {
                const content = fs.readFileSync(customProductsPath, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(content.trim() || '[]');
                return;
              }
              res.setHeader('Content-Type', 'application/json');
              res.end('[]');
              return;
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                const customProductsPath = path.resolve(__dirname, 'src/data/customProducts.json');
                if (data.reset) {
                  if (fs.existsSync(customProductsPath)) {
                    fs.writeFileSync(customProductsPath, '[]', 'utf8');
                  }
                } else if (Array.isArray(data.products)) {
                  // Merge with existing images so a stale incoming product never wipes out an image!
                  const registryPath = path.resolve(__dirname, 'src/data/persistedImages.ts');
                  let currentMap: Record<string, string> = {};
                  if (fs.existsSync(registryPath)) {
                    try {
                      const content = fs.readFileSync(registryPath, 'utf8');
                      const m = content.match(/export const persistedImages: Record<string, string> = (\{[\s\S]*?\});/);
                      if (m) currentMap = JSON.parse(m[1]);
                    } catch {}
                  }
                  for (const p of data.products) {
                    if (p.imageUrl && p.imageUrl.startsWith('data:image')) {
                      try {
                        const result = saveImageToDisk(`product_${p.id}`, p.imageUrl);
                        p.imageUrl = result.publicPath;
                        currentMap[`product_${p.id}`] = result.publicPath;
                      } catch (err) {
                        console.error('Failed to save product image to disk:', err);
                      }
                    } else {
                      const mappedImg = currentMap[`product_${p.id}`];
                      if (mappedImg && (!p.imageUrl || !p.imageUrl.includes('/images/uploads/'))) {
                        p.imageUrl = mappedImg;
                      }
                    }
                  }
                  fs.writeFileSync(customProductsPath, JSON.stringify(data.products, null, 2), 'utf8');

                  // Rebuild downloads asynchronously if products updated with new images
                  const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');
                  exec(`python3 "${scriptPath}" --type=all`, (err) => {
                    if (err) console.warn('[Auto Package] Error:', err);
                    else console.log('[Auto Package] Packages updated after sync-products!');
                  });
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        if (req.url === '/api/package-fresh' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { type = 'all' } = body ? JSON.parse(body) : {};
              const validTypes = ['dist', 'source', 'all'];
              const packageType = validTypes.includes(type) ? type : 'all';

              console.log(`[Package Fresh] Packaging on-demand initiated for type: ${packageType}...`);
              const scriptPath = path.resolve(__dirname, 'scripts/package-downloads.py');

              exec(`python3 "${scriptPath}" --type=${packageType}`, (error, stdout, stderr) => {
                if (error) {
                  console.error('[Package Fresh] Error packaging:', error, stderr);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: error.message, details: stderr }));
                  return;
                }
                console.log('[Package Fresh] Completed successfully.');
                const filename = packageType === 'source' ? 'kemizone_source_code.zip' : 'kemizone_website_hosting_dist.zip';
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  type: packageType,
                  filename,
                  url: `/downloads/${filename}?t=${Date.now()}`
                }));
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url && (req.url.startsWith('/downloads/') || req.url.startsWith('/api/download-zip'))) {
          let filename = '';
          if (req.url.startsWith('/api/download-zip')) {
            try {
              const parsedUrl = new URL(req.url, 'http://localhost');
              const typeParam = parsedUrl.searchParams.get('type') || 'dist';
              if (typeParam === 'source') {
                filename = 'kemizone_source_code.zip';
              } else if (typeParam === 'text') {
                filename = 'kemizone_source_code.txt';
              } else {
                filename = 'kemizone_website_hosting_dist.zip';
              }
            } catch {
              filename = 'kemizone_website_hosting_dist.zip';
            }
          } else {
            filename = path.basename(req.url.split('?')[0]);
          }

          let filePath = path.resolve(__dirname, 'public/downloads', filename);
          if (!fs.existsSync(filePath)) {
            filePath = path.resolve(__dirname, 'dist/downloads', filename);
          }

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const fileBuffer = fs.readFileSync(filePath);
            const contentType = filename.endsWith('.txt') 
              ? 'text/plain; charset=utf-8' 
              : 'application/octet-stream';

            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', fileBuffer.length);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Accept-Ranges', 'none');
            res.end(fileBuffer);
            return;
          } else {
            // NEVER call next() here, because next() would serve index.html (SPA fallback) as a fake corrupted 10KB zip!
            console.warn(`[Downloads] File not found: ${filename}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(`File ${filename} is not ready or does not exist on disk. Please refresh.`);
            return;
          }
        }

        if (req.url === '/api/translate' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { text, from, to, field } = JSON.parse(body || '{}');
              if (!text || typeof text !== 'string' || !text.trim()) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ translation: '' }));
                return;
              }

              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI();

              const targetLang = to === 'ar' ? 'Arabic' : 'English';
              const sourceLang = from === 'ar' ? 'Arabic' : 'English';

              const prompt = `You are an expert chemical industry and materials translator for Kemizone Chemical Commercial Co.
Translate the following ${sourceLang} text into professional, accurate ${targetLang} suitable for technical chemical data sheets, packaging, and product catalogs.

Context field: ${field || 'chemical details'}.

CRITICAL REQUIREMENTS:
- Output ONLY the translated text.
- Do NOT output preamble, explanations, markdown quotes, bullets (unless input has bullets), or alternatives.
- Keep chemical IUPAC/trade names, packaging units (kg, drums, totes, pallets, mesh, %, etc.) strictly accurate.

Text to translate:
${text.trim()}`;

              let translatedText = '';
              try {
                const response = await ai.models.generateContent({
                  model: 'gemini-3.1-flash-lite',
                  contents: prompt,
                });
                translatedText = response.text ? response.text.trim() : '';
              } catch (firstErr) {
                console.warn('[Translate API] fallback to gemini-3.8-flash:', firstErr);
                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                });
                translatedText = response.text ? response.text.trim() : '';
              }

              // Clean up any extraneous quotes
              translatedText = translatedText.replace(/^["'«»]+|["'«»]+$/g, '').trim();

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ translation: translatedText }));
            } catch (err: any) {
              console.error('[Translation API Error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const dataDir = path.resolve(__dirname, 'data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              const inquiriesPath = path.join(dataDir, 'customer_inquiries.json');
              let inquiries: any[] = [];
              if (fs.existsSync(inquiriesPath)) {
                try {
                  inquiries = JSON.parse(fs.readFileSync(inquiriesPath, 'utf8'));
                } catch {
                  inquiries = [];
                }
              }
              const entry = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                recipient: payload.recipient || 'nasser.alkhatib@kemizone.com',
                ...payload,
              };
              inquiries.unshift(entry);
              fs.writeFileSync(inquiriesPath, JSON.stringify(inquiries, null, 2), 'utf8');
              console.log(`[Kemizone Mail Dispatcher] Sourcing/Contact inquiry routed to ${entry.recipient}:`, entry);

              // Real Email Dispatch to nasser.alkhatib@kemizone.com via FormSubmit Gateway
              try {
                const target = entry.recipient || 'nasser.alkhatib@kemizone.com';
                const clientName = entry.data?.name || 'زائر موقع كميزون';
                const clientMobile = entry.data?.mobile || entry.data?.phone || '';
                const clientAddress = entry.data?.address || '';
                const clientMessage = entry.data?.message || entry.subject || '';

                fetch(`https://formsubmit.co/ajax/${encodeURIComponent(target)}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://kemizone.com',
                    'Referer': 'https://kemizone.com/contact',
                  },
                  body: JSON.stringify({
                    _subject: entry.subject || `[طلب تواصل موقع كميزون] من: ${clientName}`,
                    'الاسم الكريم': clientName,
                    'العنوان والمدينة': clientAddress,
                    'رقم الموبايل': clientMobile,
                    'نص الرسالة والاستفسار': clientMessage,
                    _template: 'table',
                  }),
                }).then(async (r) => {
                  const text = await r.text();
                  console.log(`[Kemizone Mail Dispatcher] Forward result for ${target}:`, text);
                }).catch((e) => console.warn('[Kemizone Mail Dispatcher] Forward failed:', e));
              } catch (dispatchErr) {
                console.warn('[Kemizone Mail Dispatcher] Error initiating forward:', dispatchErr);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, recipient: entry.recipient, id: entry.id }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), imagePersistencePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
