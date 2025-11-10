// Central place for all product images
export const productImages: Record<string, string> = {
  'modern-ceramic-vase': 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
  'minimalist-table-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
  'handwoven-throw-blanket': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
  'stone-coaster-set': 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800',
};

export function getProductImage(slug: string, fallback?: string): string {
  return productImages[slug] || fallback || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
}