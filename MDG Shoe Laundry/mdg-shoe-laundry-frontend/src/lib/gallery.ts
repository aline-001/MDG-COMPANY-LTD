export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const GALLERY_STORAGE_KEY = 'mdg-gallery-items';

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'default-1',
    title: 'Classic White Revival',
    description: 'A crisp white finish with deep stain removal and a refreshed surface texture.',
    category: 'Sneakers',
    image: '/gallery/cleaned-shoe-1.svg',
  },
  {
    id: 'default-2',
    title: 'Leather Luxe Restore',
    description: 'Premium leather restored with a smooth, polished finish and rich tonal depth.',
    category: 'Leather',
    image: '/gallery/cleaned-shoe-2.svg',
  },
  {
    id: 'default-3',
    title: 'Everyday Pair Refresh',
    description: 'A refined finish designed for regular daily wear and long-term presentation.',
    category: 'Daily Wear',
    image: '/gallery/cleaned-shoe-3.svg',
  },
  {
    id: 'default-4',
    title: 'Soft Touch Finish',
    description: 'A carefully finished result that gives footwear a polished, premium look.',
    category: 'Premium Care',
    image: '/gallery/cleaned-shoe-4.svg',
  },
];

export function getStoredGalleryItems(): GalleryItem[] {
  if (typeof window === 'undefined') {
    return DEFAULT_GALLERY_ITEMS;
  }

  const stored = window.localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!stored) {
    return DEFAULT_GALLERY_ITEMS;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as GalleryItem[];
    }
  } catch {
    // Fall back to default items when storage is invalid.
  }

  return DEFAULT_GALLERY_ITEMS;
}

export function saveGalleryItems(items: GalleryItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
}

export function createGalleryItem(payload: Omit<GalleryItem, 'id'>): GalleryItem {
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `gallery-${Date.now()}`,
    ...payload,
  };
}
