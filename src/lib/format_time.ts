// Source: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/format_time.ts
import { FrontendLocaleData } from 'custom-card-helpers';

export const formatTime = (dateObj: Date, locale: FrontendLocaleData) => new Intl.DateTimeFormat(locale.language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
}).format(dateObj);
