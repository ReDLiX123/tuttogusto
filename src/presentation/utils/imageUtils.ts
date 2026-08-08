export const BASE_PATH = process.env.VERCEL === '1' ? '' : (process.env.NODE_ENV === 'production' ? '/tuttogusto' : '');

export function getImageUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  if (BASE_PATH && cleanSrc.startsWith(BASE_PATH)) {
    return cleanSrc;
  }
  return `${BASE_PATH}${cleanSrc}`;
}
