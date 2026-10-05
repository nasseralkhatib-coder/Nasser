import { useState, useEffect, useCallback } from 'react';
import { getStoredImage, setStoredImage, removeStoredImage } from '../utils/imageStore';
import { persistedImages } from '../data/persistedImages';
import { resolveAssetUrl } from '../utils/assetUrl';
import { processHighResImage } from '../utils/imageProcess';

export function useStoredImage(key: string, defaultSrc?: string) {
  const rawFallback = persistedImages[key] || defaultSrc || null;
  const fallbackSrc = rawFallback ? resolveAssetUrl(rawFallback) : null;
  const [imageSrc, setImageSrc] = useState<string | null>(fallbackSrc);
  const [isCustom, setIsCustom] = useState<boolean>(Boolean(persistedImages[key]));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from store on mount or key change
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      const stored = await getStoredImage(key);
      if (isMounted) {
        if (stored) {
          setImageSrc(resolveAssetUrl(stored));
          setIsCustom(true);
        } else if (persistedImages[key]) {
          setImageSrc(resolveAssetUrl(persistedImages[key]));
          setIsCustom(true);
        } else {
          setImageSrc(defaultSrc ? resolveAssetUrl(defaultSrc) : null);
          setIsCustom(false);
        }
        setIsLoading(false);
      }
    }

    load();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; dataUrl: string | null }>;
      if (customEvent.detail && (customEvent.detail.key === key || customEvent.detail.key === '*')) {
        if (customEvent.detail.key === '*') {
          setImageSrc(defaultSrc ? resolveAssetUrl(defaultSrc) : null);
          setIsCustom(false);
          return;
        }
        if (customEvent.detail.dataUrl) {
          setImageSrc(resolveAssetUrl(customEvent.detail.dataUrl));
          setIsCustom(true);
        } else if (persistedImages[key]) {
          setImageSrc(resolveAssetUrl(persistedImages[key]));
          setIsCustom(true);
        } else {
          setImageSrc(defaultSrc ? resolveAssetUrl(defaultSrc) : null);
          setIsCustom(false);
        }
      }
    };

    window.addEventListener('kz-image-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('kz-image-updated', handleUpdate);
    };
  }, [key, defaultSrc]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      const optimizedDataUrl = await processHighResImage(file);
      const savedPath = await setStoredImage(key, optimizedDataUrl);
      setImageSrc(savedPath || optimizedDataUrl);
      setIsCustom(true);
      return savedPath || optimizedDataUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      throw err;
    }
  }, [key]);

  const resetImage = useCallback(async () => {
    await removeStoredImage(key);
    setImageSrc(defaultSrc || null);
    setIsCustom(false);
  }, [key, defaultSrc]);

  return {
    imageSrc,
    isCustom,
    isLoading,
    uploadImage,
    resetImage,
  };
}
