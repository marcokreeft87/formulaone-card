// Source: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/format_date_time.ts

import { FrontendLocaleData } from 'custom-card-helpers';
import { useAmPm } from './use_am_pm';

export const formatDateTime = (dateObj: Date, locale: FrontendLocaleData) => new Intl.DateTimeFormat(locale.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: useAmPm(locale) ? 'numeric' : '2-digit',
    minute: '2-digit',
    hour12: useAmPm(locale),
}).format(dateObj);

export const formatDateTimeRaceInfo = (dateObj: Date, locale: FrontendLocaleData) => new Intl.DateTimeFormat(locale.language, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: useAmPm(locale),
}).format(dateObj);