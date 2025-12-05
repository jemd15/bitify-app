import { AppLanguage } from './languages';

export function formatDate(date: Date, locale: AppLanguage): string {
  return new Intl.DateTimeFormat(locale === AppLanguage.ES ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatNumber(value: number, locale: AppLanguage): string {
  return new Intl.NumberFormat(locale === AppLanguage.ES ? 'es-ES' : 'en-US').format(
    value,
  );
}

export function formatCurrency(
  value: number,
  locale: AppLanguage,
  currency = 'EUR',
): string {
  return new Intl.NumberFormat(locale === AppLanguage.ES ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency,
  }).format(value);
}
