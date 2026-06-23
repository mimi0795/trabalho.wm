export const SITE_NAME = 'Passo Prime';
export const SITE_INITIALS = 'PP';
export const LOCALE = 'pt-BR';
export const FREE_SHIPPING_THRESHOLD = 700;
export const STANDARD_SHIPPING = 29.9;
export const TAX_RATE = 0.08;

export function formatCurrency(value: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatRating(value: number) {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const categoryLabels: Record<string, string> = {
  Lifestyle: 'Casual',
  Running: 'Corrida',
  Basketball: 'Basquete',
  Training: 'Treino',
  Outdoor: 'Outdoor',
};

export function translateCategory(category: string) {
  return categoryLabels[category] ?? category;
}
