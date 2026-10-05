// Custom fleet image helper - cleared of any stale raster images
export const getCustomFleetImage = (): string => {
  try {
    localStorage.removeItem('kemizone_cars_image');
  } catch {}
  return '';
};

export const setCustomFleetImage = (_dataUrl: string): void => {
  // Stale raster storage deprecated
};
