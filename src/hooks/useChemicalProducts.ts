import { useState, useEffect, useCallback } from 'react';
import { ChemicalProduct } from '../types';
import { chemicalProducts as defaultProducts } from '../data/products';
import { isDevEnvironment } from '../utils/envHelper';
import { getStoredImage, setStoredImage } from '../utils/imageStore';

const STORAGE_KEY = 'kemizone_catalog_37products_v5';
const UPDATE_EVENT = 'kz-products-changed';

function mergeWithDefaults(incoming: ChemicalProduct[]): ChemicalProduct[] {
  const map = new Map<string, ChemicalProduct>();

  // 1. Put all default products into map
  for (const def of defaultProducts) {
    const clean = { ...def };
    delete clean.formula;
    map.set(clean.id, clean);
  }

  // 2. Overlay incoming items, updating IDs and preserving any custom images
  for (const item of incoming) {
    let targetId = item.id;
    if (targetId === 'co-polymer' || targetId === 'chem-copolymer') {
      targetId = 'copolymer-emulsion';
    } else if (targetId === 'pigments-organic-inorganic') {
      targetId = 'organic-pigments';
    }

    const base = map.get(targetId);
    if (base) {
      // Discard any old SVG or placeholder images from older cached sessions
      const resolvedImg = (!item.imageUrl || item.imageUrl.includes('/images/catalog/'))
        ? base.imageUrl
        : item.imageUrl;

      map.set(targetId, {
        ...base,
        ...item,
        id: targetId,
        imageUrl: resolvedImg,
        name: (targetId === 'copolymer-emulsion' || targetId === 'organic-pigments' || targetId === 'inorganic-pigment') ? base.name : (item.name || base.name),
      });
    } else {
      map.set(targetId, item);
    }
  }

  // 3. Ensure copolymer-emulsion, organic-pigments, and inorganic-pigment definitely exist
  const copoly = defaultProducts.find((p) => p.id === 'copolymer-emulsion');
  if (copoly && !map.has('copolymer-emulsion')) {
    map.set('copolymer-emulsion', copoly);
  }
  const orgPig = defaultProducts.find((p) => p.id === 'organic-pigments');
  if (orgPig && !map.has('organic-pigments')) {
    map.set('organic-pigments', orgPig);
  }
  const inorgPig = defaultProducts.find((p) => p.id === 'inorganic-pigment');
  if (inorgPig && !map.has('inorganic-pigment')) {
    map.set('inorganic-pigment', inorgPig);
  }

  return Array.from(map.values()).map((p) => {
    const clean = { ...p };
    delete clean.formula;
    return clean;
  });
}

function sanitizeProducts(prods: ChemicalProduct[]): ChemicalProduct[] {
  return mergeWithDefaults(prods);
}

// Persistent in-memory singleton cache to guarantee immediate synchronization across all components
let memoryProducts: ChemicalProduct[] = mergeWithDefaults(defaultProducts);
let hasInitialized = false;

function loadStoredProducts(): ChemicalProduct[] {
  if (typeof window !== 'undefined') {
    // Clean up older cache keys
    try {
      localStorage.removeItem('kemizone_catalog_36products_v1');
      localStorage.removeItem('kemizone_catalog_36products_v2');
      localStorage.removeItem('kemizone_catalog_36products_v3');
      localStorage.removeItem('kemizone_catalog_36products_v4');
      localStorage.removeItem('kemizone_catalog_37products_v1');
      localStorage.removeItem('kemizone_catalog_37products_v2');
      localStorage.removeItem('kemizone_catalog_37products_v3');
      localStorage.removeItem('kemizone_catalog_37products_v4');
    } catch {}

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeWithDefaults(parsed);
        }
      }
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }

    try {
      const sessionStored = sessionStorage.getItem(STORAGE_KEY);
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeWithDefaults(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return mergeWithDefaults(defaultProducts);
}

// Initialize memory cache on first load
function ensureInitialized() {
  if (!hasInitialized) {
    const loaded = loadStoredProducts();
    if (loaded && loaded.length > 0) {
      memoryProducts = loaded;
    }
    hasInitialized = true;
  }
}

// Background persistence to IndexedDB, localStorage, sessionStorage, and dev server
async function persistProducts(products: ChemicalProduct[]) {
  const serialized = JSON.stringify(products);

  // 1. IndexedDB persistence (Never restricted by quota, survives browser restarts)
  try {
    await setStoredImage(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Could not write products to IndexedDB:', err);
  }

  // 2. Also ensure custom images are stored in IndexedDB under their product keys
  for (const p of products) {
    if (p.imageUrl && (p.imageUrl.startsWith('data:image/') || p.imageUrl.startsWith('blob:'))) {
      try {
        await setStoredImage(`product_${p.id}`, p.imageUrl);
      } catch {}
    }
  }

  // 3. LocalStorage (best effort)
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Could not write to localStorage:', err);
  }

  // 4. SessionStorage
  try {
    sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    // ignore
  }

  // 5. Server-side persistence via POST /api/sync-products
  try {
    await fetch('/api/sync-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });
  } catch (err) {
    // best-effort server sync
  }
}

export function useChemicalProducts() {
  ensureInitialized();

  const [products, setProducts] = useState<ChemicalProduct[]>(() => memoryProducts);
  const isDev = isDevEnvironment();

  useEffect(() => {
    // Always sync with current memoryProducts on mount
    setProducts([...memoryProducts]);

    // Hydrate from IndexedDB if available (guaranteed persistent storage)
    getStoredImage(STORAGE_KEY).then((idbVal) => {
      if (idbVal) {
        try {
          const parsed = JSON.parse(idbVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const clean = sanitizeProducts(parsed);
            memoryProducts = clean;
            setProducts(clean);
          }
        } catch {
          // ignore
        }
      }
    });

    // Hydrate from server in background if available
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const clean = sanitizeProducts(data);
          memoryProducts = clean;
          setProducts(clean);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ products?: ChemicalProduct[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.products)) {
        memoryProducts = customEvent.detail.products;
        setProducts(customEvent.detail.products);
      } else {
        const fresh = loadStoredProducts();
        memoryProducts = fresh;
        setProducts(fresh);
      }
    };

    const handleImageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string; dataUrl?: string | null; publicPath?: string }>;
      if (customEvent.detail && customEvent.detail.key && customEvent.detail.key.startsWith('product_')) {
        const prodId = customEvent.detail.key.replace('product_', '');
        const newImg = customEvent.detail.publicPath || customEvent.detail.dataUrl;
        if (newImg) {
          const idx = memoryProducts.findIndex((p) => p.id === prodId || (prodId === 'top-cell-hpmc' && p.id === 'hpmc'));
          if (idx >= 0) {
            const updated = [...memoryProducts];
            updated[idx] = { ...updated[idx], imageUrl: newImg };
            memoryProducts = updated;
            setProducts(updated);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
          }
        }
      }
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('kz-image-updated', handleImageUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('kz-image-updated', handleImageUpdate);
    };
  }, []);

  const updateProduct = useCallback((updated: ChemicalProduct) => {
    ensureInitialized();

    const index = memoryProducts.findIndex((p) => p.id === updated.id);
    let newProducts: ChemicalProduct[];
    if (index >= 0) {
      newProducts = [...memoryProducts];
      newProducts[index] = { ...newProducts[index], ...updated };
    } else {
      newProducts = [updated, ...memoryProducts];
    }

    // 1. Update singleton in-memory list immediately
    memoryProducts = newProducts;

    // 2. Update local React state immediately
    setProducts(newProducts);

    // 3. Persist to storage & server asynchronously
    persistProducts(newProducts);

    // 4. Notify all other listening components with the exact new list
    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, { detail: { products: newProducts } })
    );

    // 5. Also ensure image listeners update immediately
    if (updated.imageUrl) {
      setStoredImage(`product_${updated.id}`, updated.imageUrl).catch(() => {});
      window.dispatchEvent(
        new CustomEvent('kz-image-updated', {
          detail: { key: `product_${updated.id}`, dataUrl: updated.imageUrl },
        })
      );
    }
  }, []);

  const deleteProduct = useCallback((id: string) => {
    ensureInitialized();

    const newProducts = memoryProducts.filter((p) => p.id !== id);
    memoryProducts = newProducts;
    setProducts(newProducts);
    persistProducts(newProducts);

    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, { detail: { products: newProducts } })
    );
  }, []);

  const addProduct = useCallback((newProduct: ChemicalProduct) => {
    ensureInitialized();

    const newProducts = [newProduct, ...memoryProducts];
    memoryProducts = newProducts;
    setProducts(newProducts);
    persistProducts(newProducts);

    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, { detail: { products: newProducts } })
    );
  }, []);

  const resetToDefaultProducts = useCallback(() => {
    memoryProducts = defaultProducts;
    setProducts(defaultProducts);

    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      fetch('/api/sync-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, { detail: { products: defaultProducts } })
    );
  }, []);

  return {
    products,
    deleteProduct,
    updateProduct,
    addProduct,
    resetToDefaultProducts,
    isDev,
    totalCount: products.length,
  };
}
