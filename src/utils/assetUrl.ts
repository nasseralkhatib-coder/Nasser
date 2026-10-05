/**
 * Resolves an asset path to work seamlessly across:
 * - Direct static hosting (cPanel, Apache, Hostinger, Vercel, Netlify)
 * - Local filesystem preview (file:// protocol when unzipping download)
 * - Cloud Run and Vite preview (http://localhost:3000/)
 */
export function resolveAssetUrl(src: string | null | undefined): string {
  if (!src) return '';

  // Data URLs, Blob URLs, or external HTTP/HTTPS
  if (
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('http://') ||
    src.startsWith('https://')
  ) {
    return src;
  }

  // Strip any leading './', '../', or '/' to get clean relative path
  const cleanPath = src.replace(/^(\.\/|\/)+/, '');

  // If viewing via file:// protocol directly from disk without a web server
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return './' + cleanPath;
  }

  // Standard web server root-relative path (works on all web hosts regardless of subpaths)
  return '/' + cleanPath;
}
