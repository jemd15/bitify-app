export enum AppLanguage {
  ES = 'es',
  EN = 'en',
}

export interface Language {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: AppLanguage.ES, label: 'Spanish', nativeLabel: 'Español' },
  { code: AppLanguage.EN, label: 'English', nativeLabel: 'English' },
];
