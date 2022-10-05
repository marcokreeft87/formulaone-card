// Source: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/format_date.ts
import { FrontendLocaleData } from 'custom-card-helpers';

export const formatDate = (dateObj: Date, locale: FrontendLocaleData, overrideLanguage?: string) => new Intl.DateTimeFormat(overrideLanguage ?? locale.language, {
    month: '2-digit',
    day: '2-digit',
}).format(dateObj);

export const formatDateNumeric = (dateObj: Date, locale: FrontendLocaleData, overrideLanguage?: string) => new Intl.DateTimeFormat(overrideLanguage ?? locale.language, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
}).format(dateObj);