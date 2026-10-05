// IndexedDB-based Persistent Storage for Custom Uploaded Images
const DB_NAME = 'kemizone_images_db';
const STORE_NAME = 'uploaded_images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function getStoredImage(key: string): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as string | undefined;
        if (result) {
          resolve(result);
        } else {
          // Fallback to localStorage
          const localVal = localStorage.getItem(`kz_img_${key}`);
          resolve(localVal || null);
        }
      };

      request.onerror = () => {
        const localVal = localStorage.getItem(`kz_img_${key}`);
        resolve(localVal || null);
      };
    });
  } catch {
    const localVal = localStorage.getItem(`kz_img_${key}`);
    return localVal || null;
  }
}

export async function setStoredImage(key: string, dataUrl: string): Promise<string | undefined> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataUrl, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage', err);
  }

  // Also store in localStorage if reasonable size
  try {
    if (dataUrl.length < 500000) {
      localStorage.setItem(`kz_img_${key}`, dataUrl);
    }
  } catch {
    // ignore
  }

  let savedPath: string | undefined;
  // Send to backend disk storage
  try {
    const res = await fetch('/api/save-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, dataUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.publicPath) {
        savedPath = data.publicPath;
      }
    }
  } catch (err) {
    console.warn('Backend image save failed (normal if static deployment):', err);
  }

  // Dispatch event so all components listening update immediately with disk path or dataUrl
  window.dispatchEvent(
    new CustomEvent('kz-image-updated', {
      detail: { key, dataUrl: savedPath || dataUrl, publicPath: savedPath },
    })
  );

  return savedPath;
}

export async function removeStoredImage(key: string): Promise<void> {
  // Permanently protect homepage hero image as requested by user
  if (key === 'home_hero_cars' || key === 'kemizone_cars_image') {
    return;
  }

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(`kz_img_${key}`);
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kz-image-updated', { detail: { key, dataUrl: null } }));
}

export async function clearAllStoredImages(): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const k = cursor.key as string;
          if (k !== 'home_hero_cars' && k !== 'kemizone_cars_image') {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    // ignore
  }

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('kz_img_')) {
        if (k === 'kz_img_home_hero_cars' || k === 'kemizone_cars_image') {
          continue;
        }
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kz-image-updated', { detail: { key: '*', dataUrl: null } }));
}

export async function getAllStoredImageKeys(): Promise<string[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve((request.result as string[]) || []);
      };

      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function getAllStoredImages(): Promise<Record<string, string>> {
  const images: Record<string, string> = {};

  // 1. From IndexedDB
  try {
    const db = await getDB();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (cursor.key && typeof cursor.value === 'string') {
            images[String(cursor.key)] = cursor.value;
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => resolve();
    });
  } catch {
    // ignore
  }

  // 2. From localStorage fallback
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('kz_img_')) {
        const imageKey = key.replace('kz_img_', '');
        if (!images[imageKey]) {
          const val = localStorage.getItem(key);
          if (val) images[imageKey] = val;
        }
      } else if (key && (key.startsWith('kemizone_catalog_') || key === 'kemizone_custom_products')) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              for (const item of list) {
                if (item && item.id && item.imageUrl && item.imageUrl.startsWith('data:image')) {
                  if (!images[`product_${item.id}`]) {
                    images[`product_${item.id}`] = item.imageUrl;
                  }
                }
              }
            }
          }
        } catch {}
      }
    }
  } catch {
    // ignore
  }

  // 3. Explicit check for hero images in localStorage
  try {
    const heroKeys = ['home_hero_cars', 'kemizone_cars_image', 'kz_img_home_hero_cars', 'kz_img_kemizone_cars_image'];
    for (const hk of heroKeys) {
      const val = localStorage.getItem(hk);
      if (val && typeof val === 'string' && val.startsWith('data:image')) {
        if (!images['home_hero_cars']) images['home_hero_cars'] = val;
        if (!images['kemizone_cars_image']) images['kemizone_cars_image'] = val;
      }
    }
  } catch {
    // ignore
  }

  return images;
}

export async function syncAllStoredImagesToServer(): Promise<{
  success: boolean;
  count: number;
  message?: string;
  saved?: Record<string, string>;
}> {
  try {
    const images = await getAllStoredImages();
    const count = Object.keys(images).length;
    if (count === 0) {
      return { success: true, count: 0, message: 'لا توجد صور مرفوعة حالياً للمزامنة' };
    }

    const response = await fetch('/api/sync-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      count: data.count || count,
      saved: data.saved,
      message: `تم تثبيت وحفظ ${data.count || count} صورة بنجاح في ملفات الموقع للنشر الدائم!`,
    };
  } catch (err: any) {
    console.error('syncAllStoredImagesToServer error:', err);
    return { success: false, count: 0, message: err.message || 'فشل الاتصال بالخادم' };
  }
}

export async function exportAllStoredImagesAsJSON(): Promise<void> {
  const images = await getAllStoredImages();
  const jsonStr = JSON.stringify(images, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kemizone-uploaded-images-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importStoredImagesFromJSON(jsonText: string): Promise<{ success: boolean; count: number }> {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON format');
    }

    let count = 0;
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === 'string' && val.startsWith('data:image')) {
        await setStoredImage(key, val);
        count++;
      }
    }

    // After importing all to IndexedDB, sync to server
    await syncAllStoredImagesToServer();
    return { success: true, count };
  } catch (err) {
    console.error('Failed to import images', err);
    return { success: false, count: 0 };
  }
}
