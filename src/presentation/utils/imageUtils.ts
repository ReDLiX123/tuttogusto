export const BASE_PATH = '/tuttogusto';

export function getImageUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/tuttogusto')) {
    return src;
  }
  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  return `${BASE_PATH}${cleanSrc}`;
}
