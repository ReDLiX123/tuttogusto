export function getImageUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }

  let cleanSrc = src;
  // Strip '/tuttogusto' prefix if already present to avoid duplication
  if (cleanSrc.startsWith('/tuttogusto/')) {
    cleanSrc = cleanSrc.replace('/tuttogusto', '');
  }
  if (!cleanSrc.startsWith('/')) {
    cleanSrc = `/${cleanSrc}`;
  }

  // Dynamically detect GitHub Pages subpath environment vs Vercel / Localhost
  const isGithubPages =
    typeof window !== 'undefined'
      ? window.location.hostname.includes('github.io')
      : process.env.NODE_ENV === 'production' && !process.env.VERCEL;

  const basePath = isGithubPages ? '/tuttogusto' : '';
  return `${basePath}${cleanSrc}`;
}
