export function isValidDomain(str: string): boolean {
  try {
    const url = new URL(str.startsWith('http') ? str : `https://${str}`);

    return url.hostname.split('.').length >= 2;
  } catch {
    return false;
  }
}

export function getHostnameFromUrl(url: string | URL): string | null {
  let urlp;

  try {
    urlp = new URL(url);
  } catch {
    return null;
  }

  return urlp.hostname;
}

export function isRelativeUrl(url: string): boolean {
  return /^\/[^/]/.test(url);
}

export function isExternalUrl(url: string): boolean {
  return !isRelativeUrl(url) && url.startsWith('http');
}
